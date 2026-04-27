"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Send, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender_id: string
  recipient_id: string
  is_read: boolean
  created_at: string
  sender?: {
    full_name: string | null
    role: string
  }
}

interface Profile {
  id: string
  full_name: string | null
  role: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null)
  const [brokers, setBrokers] = useState<Profile[]>([])
  const [selectedBroker, setSelectedBroker] = useState<Profile | null>(null)
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

      // Fetch brokers/admins
      const { data: brokerData } = await supabase
        .from("profiles")
        .select("*")
        .in("role", ["admin", "broker"])

      if (brokerData && brokerData.length > 0) {
        setBrokers(brokerData)
        setSelectedBroker(brokerData[0])
      }

      // Fetch messages
      const { data: messageData } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name, role)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order("created_at", { ascending: true })

      if (messageData) {
        setMessages(messageData)
        // Mark unread messages as read
        const unreadIds = messageData
          .filter(m => m.recipient_id === user.id && !m.is_read)
          .map(m => m.id)
        
        if (unreadIds.length > 0) {
          await supabase
            .from("messages")
            .update({ is_read: true })
            .in("id", unreadIds)
        }
      }

      setIsLoading(false)
    }

    fetchData()

    // Set up real-time subscription
    const channel = supabase
      .channel("messages")
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
            newMsg.sender_id === currentUser?.id ||
            newMsg.recipient_id === currentUser?.id
          ) {
            // Fetch full message with sender info
            const { data } = await supabase
              .from("messages")
              .select(`
                *,
                sender:profiles!messages_sender_id_fkey(full_name, role)
              `)
              .eq("id", newMsg.id)
              .single()

            if (data) {
              setMessages((prev) => [...prev, data])
              if (data.recipient_id === currentUser?.id) {
                await supabase
                  .from("messages")
                  .update({ is_read: true })
                  .eq("id", data.id)
              }
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, currentUser?.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser || !selectedBroker) return

    setIsSending(true)
    try {
      const { error } = await supabase.from("messages").insert({
        content: newMessage.trim(),
        sender_id: currentUser.id,
        recipient_id: selectedBroker.id,
      })

      if (!error) {
        setNewMessage("")
      }
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

  const formatDate = (date: string) => {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (d.toDateString() === today.toDateString()) {
      return "Today"
    } else if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return d.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    }
  }

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {}
  messages.forEach((msg) => {
    const date = new Date(msg.created_at).toDateString()
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(msg)
  })

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Messages</h1>
        <p className="mt-1 text-muted-foreground">
          Chat with your broker about your loan applications
        </p>
      </div>

      <Card className="flex h-[calc(100vh-300px)] min-h-[500px] flex-col lg:h-[calc(100vh-220px)]">
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {selectedBroker?.full_name?.[0] || "B"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedBroker?.full_name || "Your Broker"}</p>
              <p className="text-xs font-normal text-muted-foreground">
                {selectedBroker?.role === "admin" ? "Admin" : "Broker"}
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
                Send a message to start a conversation with your broker.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(dateMessages[0].created_at)}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="space-y-3">
                    {dateMessages.map((message) => {
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
                  </div>
                </div>
              ))}
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
              disabled={isSending || !selectedBroker}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isSending || !newMessage.trim() || !selectedBroker}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          {!selectedBroker && (
            <p className="mt-2 text-xs text-muted-foreground">
              A broker will be assigned to you shortly.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
