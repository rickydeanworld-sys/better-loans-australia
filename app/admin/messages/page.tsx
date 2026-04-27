"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, MessageSquare, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender_id: string
  recipient_id: string
  is_read: boolean
  created_at: string
}

interface Client {
  id: string
  full_name: string | null
  email: string
  unreadCount: number
  lastMessage?: string
  lastMessageTime?: string
}

export default function AdminMessagesPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setCurrentUser(user)

      // Fetch all clients
      const { data: clientData } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "client")
        .order("full_name")

      if (clientData) {
        // Get message stats for each client
        const clientsWithStats = await Promise.all(
          clientData.map(async (client) => {
            const { count } = await supabase
              .from("messages")
              .select("*", { count: "exact", head: true })
              .eq("sender_id", client.id)
              .eq("recipient_id", user.id)
              .eq("is_read", false)

            const { data: lastMsg } = await supabase
              .from("messages")
              .select("content, created_at")
              .or(`sender_id.eq.${client.id},recipient_id.eq.${client.id}`)
              .order("created_at", { ascending: false })
              .limit(1)
              .single()

            return {
              ...client,
              unreadCount: count || 0,
              lastMessage: lastMsg?.content,
              lastMessageTime: lastMsg?.created_at,
            }
          })
        )

        // Sort by unread count then by last message time
        clientsWithStats.sort((a, b) => {
          if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount
          if (!a.lastMessageTime) return 1
          if (!b.lastMessageTime) return -1
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        })

        setClients(clientsWithStats)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [supabase])

  useEffect(() => {
    if (!selectedClient || !currentUser) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${selectedClient.id},recipient_id.eq.${currentUser.id}),and(sender_id.eq.${currentUser.id},recipient_id.eq.${selectedClient.id})`
        )
        .order("created_at", { ascending: true })

      if (data) {
        setMessages(data)
        // Mark messages as read
        const unreadIds = data
          .filter(m => m.sender_id === selectedClient.id && !m.is_read)
          .map(m => m.id)
        
        if (unreadIds.length > 0) {
          await supabase
            .from("messages")
            .update({ is_read: true })
            .in("id", unreadIds)

          // Update client's unread count
          setClients(prev => 
            prev.map(c => 
              c.id === selectedClient.id ? { ...c, unreadCount: 0 } : c
            )
          )
        }
      }
    }

    fetchMessages()

    // Set up real-time subscription
    const channel = supabase
      .channel(`messages-${selectedClient.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMsg = payload.new as Message
          if (
            (newMsg.sender_id === selectedClient.id && newMsg.recipient_id === currentUser.id) ||
            (newMsg.sender_id === currentUser.id && newMsg.recipient_id === selectedClient.id)
          ) {
            setMessages((prev) => [...prev, newMsg])
            if (newMsg.sender_id === selectedClient.id) {
              await supabase
                .from("messages")
                .update({ is_read: true })
                .eq("id", newMsg.id)
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, selectedClient, currentUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser || !selectedClient) return

    setIsSending(true)
    try {
      await supabase.from("messages").insert({
        content: newMessage.trim(),
        sender_id: currentUser.id,
        recipient_id: selectedClient.id,
      })
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatRelativeTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return formatTime(date)
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short" })
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Messages</h1>
        <p className="mt-1 text-muted-foreground">
          Communicate with your clients
        </p>
      </div>

      <div className="grid h-[calc(100vh-300px)] min-h-[500px] gap-4 md:grid-cols-3 lg:h-[calc(100vh-220px)]">
        {/* Client List */}
        <Card className="md:col-span-1">
          <CardHeader className="border-b px-4 py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5" />
              Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full overflow-y-auto p-0">
            {clients.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                <Users className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No clients yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={cn(
                      "flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50",
                      selectedClient?.id === client.id && "bg-muted"
                    )}
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback>
                        {client.full_name?.[0] || client.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-medium">
                          {client.full_name || client.email}
                        </p>
                        {client.unreadCount > 0 && (
                          <Badge variant="destructive" className="shrink-0">
                            {client.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {client.lastMessage && (
                        <p className="truncate text-sm text-muted-foreground">
                          {client.lastMessage}
                        </p>
                      )}
                      {client.lastMessageTime && (
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(client.lastMessageTime)}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex flex-col md:col-span-2">
          {!selectedClient ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="font-medium">Select a client</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose a client from the list to start messaging
              </p>
            </div>
          ) : (
            <>
              <CardHeader className="border-b px-4 py-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {selectedClient.full_name?.[0] || selectedClient.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {selectedClient.full_name || selectedClient.email}
                    </p>
                    <p className="text-xs font-normal text-muted-foreground">
                      {selectedClient.email}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/50" />
                    <h3 className="font-medium">No messages yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Send a message to start the conversation
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => {
                      const isOwn = message.sender_id === currentUser?.id
                      return (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            isOwn ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg px-4 py-2",
                              isOwn
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={cn(
                                "mt-1 text-xs",
                                isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                              )}
                            >
                              {formatTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </CardContent>

              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[44px] resize-none"
                    rows={1}
                    disabled={isSending}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                  />
                  <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
