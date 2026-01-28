"use client"

import { useState, useEffect, useRef } from "react"
import { Paperclip, Upload, Send, Mic, Facebook, MessageCircle, Music } from "lucide-react"
import { useNavigate } from "react-router-dom"
import InteractiveSriLankaMap from "./map"
import { generateTripPlan } from "../services/aiTripPlannerService"

export default function Home() {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [tripQuery, setTripQuery] = useState("")
  const [showUploadSection, setShowUploadSection] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState(null)
  const [error, setError] = useState(null)
  
  // AI Travel Assistant chat messages
  const [assistantMessages, setAssistantMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI Travel Assistant. How can I help you plan your perfect Sri Lankan adventure today?',
      timestamp: new Date(),
    },
  ])
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [assistantMessages, isLoading])
  
  // Custom AI Chat Widget State
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m Ceyluxe AI, your personal travel assistant. How can I help you plan your perfect Sri Lankan adventure today?',
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)

  // Handle chat message sending
  const handleChatSend = async () => {
    if (!chatInput.trim()) return

    const userMessage = {
      id: chatMessages.length + 1,
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput("")
    setIsChatLoading(true)

    try {
      const response = await generateTripPlan(chatInput)
      const aiMessage = {
        id: chatMessages.length + 2,
        role: 'assistant',
        content: response?.response || response?.message || JSON.stringify(response),
        timestamp: new Date(),
      }
      setChatMessages(prev => [...prev, aiMessage])
    } catch (err) {
      const errorMessage = {
        id: chatMessages.length + 2,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}. Please try again.`,
        timestamp: new Date(),
        isError: true,
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsChatLoading(false)
    }
  }

  // Remove Botpress, we'll use custom chat

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }
  
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleSendMessage = async () => {
    if (tripQuery.trim()) {
      console.log("Sending query:", tripQuery)
      const currentQuery = tripQuery
      
      setAssistantMessages(prev => {
        const userMessage = {
          id: prev.length + 1,
          role: 'user',
          content: currentQuery,
          timestamp: new Date(),
        }
        return [...prev, userMessage]
      })
      
      setTripQuery("")
      setIsLoading(true)
      setError(null)
      setSelectedFile(null)
      setShowUploadSection(false)
      
      try {
        const response = await generateTripPlan(currentQuery)
        console.log("AI Response:", response)
        setAssistantMessages(prev => {
          const aiMessage = {
            id: prev.length + 1,
            role: 'assistant',
            content: response?.response || response?.message || JSON.stringify(response),
            timestamp: new Date(),
          }
          return [...prev, aiMessage]
        })
      } catch (err) {
        console.error("Error:", err)
        setAssistantMessages(prev => {
          const errorMessage = {
            id: prev.length + 1,
            role: 'assistant',
            content: `Sorry, I encountered an error: ${err.message}. Please try again.`,
            timestamp: new Date(),
            isError: true,
          }
          return [...prev, errorMessage]
        })
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Add Google Font in a style tag */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Agbalumo&display=swap');
          .agbalumo-font {
            font-family: 'Agbalumo', sans-serif;
          }
        `}
      </style>

      {/* Hero Section with Agbalumo font */}
      <div className="relative mt-4 sm:mt-6 lg:mt-8 mx-2 sm:mx-4 lg:mx-8">
        <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden">
          <img
            src="/images/hero.jpg"
            alt="Beautiful tropical island with crystal clear water"
            className="w-full h-full object-cover"
          />

          {/* Hero Content Overlay with font changes */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-2 sm:px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4 drop-shadow-lg agbalumo-font">
              Welcome To
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl">Magic Island</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 drop-shadow-md font-medium agbalumo-font">
              Adventure Starts Here
            </p>
            <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 lg:mb-8 drop-shadow-md agbalumo-font">
              Sri Lanka
            </p>
            <button 
              className="bg-white/20 backdrop-blur-sm border-2 border-white text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base"
              onClick={() => {
                document.getElementById('ai-assistant')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Plan Your Trip With AI
            </button>
          </div>
        </div>

        {/* Social media icons */}
        <div className="flex justify-center space-x-3 sm:space-x-4 mt-4 sm:mt-2">
          <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer min-w-[60px] sm:min-w-[70px]">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 mb-1">
                <Facebook className="w-full h-full text-blue-600" />
              </div>
              <span className="text-[8px] sm:text-xs font-medium text-gray-700">Facebook</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer min-w-[60px] sm:min-w-[70px]">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 mb-1">
                <MessageCircle className="w-full h-full text-green-500" />
              </div>
              <span className="text-[8px] sm:text-xs font-medium text-gray-700">Whatsapp</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer min-w-[60px] sm:min-w-[70px]">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 mb-1">
                <Music className="w-full h-full text-black" />
              </div>
              <span className="text-[8px] sm:text-xs font-medium text-gray-700">Tik tok</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Travel Assistant Section */}
      <div id="ai-assistant" className="max-w-4xl mx-auto px-4 sm:px-4 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
            <span className="text-cyan-400">AI</span> <span className="text-gray-800">Travel</span>{" "}
            <span className="text-cyan-400">Assistant</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Effortlessly Plan Your Trip With Smart AI Assistance
          </p>
        </div>

        {/* ChatGPT-like Chat Interface */}
        <div className="bg-cyan-500 rounded-xl sm:rounded-2xl shadow-xl flex flex-col w-full" style={{ maxHeight: '80vh' }}>
          {/* Chat Messages Container */}
          <div className="p-4 sm:p-6 space-y-4 bg-gray-50 overflow-y-auto scroll-smooth" style={{ maxHeight: 'calc(80vh - 100px)' }}>
            {assistantMessages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[75%] ${message.role === 'user' ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user' 
                      ? 'bg-cyan-500 text-white rounded-br-md' 
                      : message.isError 
                        ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-md'
                        : 'bg-cyan-100 text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                  }`}>
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  <span className={`text-xs text-gray-500 mt-1 px-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Section */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={tripQuery}
                  onChange={(e) => setTripQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Let AI Help You Plan Your Perfect Getaway..."
                  className="w-full px-4 py-3 pr-12 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isLoading}
                />
              </div>
              <button 
                className="bg-cyan-500 text-white p-3 rounded-full hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                onClick={handleSendMessage}
                disabled={isLoading || !tripQuery.trim()}
              >
                {isLoading ? (
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Best Selling Tour Packages Section */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Title and Description */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                <span className="text-gray-800">Best Selling</span>{" "}
                <span className="text-cyan-400">Tour Packages</span>
              </h2>
              <p className="text-gray-600 mb-6">
                Discover our most popular tour packages curated by thousands of happy travelers
              </p>
              <button className="bg-cyan-400 hover:bg-cyan-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300 shadow-lg">
                View All Packages
              </button>
              <div className="mt-8 hidden lg:block">
                <div className="bg-gradient-to-r from-cyan-100 to-blue-100 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Why Choose Us?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>5000+ Happy Customers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Local Expert Guides</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Flexible Cancellation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>24/7 Customer Support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Tour Packages Grid */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* History & Culture */}
              <div 
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-64"
                onClick={() => navigate('/planning/category/cultural-heritage')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-600">
                  <img
                    src="/images/history.jpg"
                    alt="History & Culture"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-bold text-lg">History & Culture</h3>
                  <p className="text-gray-200 text-sm">Explore ancient temples and rich heritage</p>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                </div>
              </div>

              {/* Adventure Tours */}
              <div 
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-64"
                onClick={() => navigate('/planning/category/adventure-tours')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600">
                  <img
                    src="/images/misty.jpg"
                    alt="Adventure Tours"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-bold text-lg">Adventure Tours</h3>
                  <p className="text-gray-200 text-sm">Tea plantations and cool climates</p>
                </div>
              </div>

              {/* Wildlife & Nature */}
              <div 
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-64"
                onClick={() => navigate('/planning/category/wildlife-nature')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-600">
                  <img
                    src="/images/safari.jpg"
                    alt="Wildlife & Nature"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-bold text-lg">Wildlife & Nature</h3>
                  <p className="text-gray-200 text-sm">Elephants, leopards and more</p>
                </div>
              </div>

              {/* Honeymoon Packages */}
              <div 
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-64"
                onClick={() => navigate('/planning/category/honeymoon-packages')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-600">
                  <img
                    src="/images/honeymoon.jpg"
                    alt="Honeymoon Packages"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-bold text-lg">Honeymoon</h3>
                  <p className="text-gray-200 text-sm">Romantic getaways for couples</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sri Lanka Map Section */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
            <span className="text-cyan-400">Explore</span>{" "}
            <span className="text-gray-800">Sri Lanka</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2 mt-4">
            Click on the map to discover popular destinations and attractions
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <InteractiveSriLankaMap />
        </div>
      </div>

      {/* Tour Packages & Top Places to Visit Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 mb-16 sm:mb-20 lg:mb-24">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
            <span className="text-cyan-400">TOUR PACKAGES &</span>{" "}
            <span className="text-gray-800">TOP PLACES TO VISIT</span>
          </h2>
        </div>

        {/* Tour Packages List */}
        <div className="space-y-8 sm:space-y-12">
          {/* Beach Getaway Package */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex gap-3 flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md">
                <img src="/images/beach-1.jpg" alt="Beach view" className="w-full h-full object-cover" />
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md">
                <img src="/images/beach-2.jpg" alt="Coastal view" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                Beach getaway package soak in the sun,surf and golden sands!
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                <span className="font-semibold">Recommended places:</span> mirissa, unawatuna, benthota, hikkaduwa,
                nilaveli, arugam bay
              </p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <span className="text-black text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
            </div>
          </div>

          {/* Cultural Heritage Tour */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex gap-3 flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md">
                <img src="/images/cultural-1.jpg" alt="Ancient temple" className="w-full h-full object-cover" />
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md">
                <img src="/images/cultural-2.jpg" alt="Historical site" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                Cultural heritage tour explore ancient kingdoms and sacred temple.
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                <span className="font-semibold">Recommend place:</span> sigiriya rock fortress, polonnaruwa, dambulla
                cave temple of the tooth (kandy)
              </p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-black text-lg">★</span>
            </div>
          </div>

          {/* Spiritual & Wellness Retreat */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex gap-3 flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md">
                <img src="/images/wellness-1.jpg" alt="Meditation center" className="w-full h-full object-cover" />
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md">
                <img src="/images/wellness-2.jpg" alt="Yoga retreat" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                Spiritual & wellness retreat find your inner peace with yoga and meditation in scenic surrounding.
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                <span className="font-semibold">Recommended place:</span> dambulla, arugam bay(retreat centers), kandy
                (meditation center) hunnasgiriya
              </p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
            </div>
          </div>

          {/* Romantic Honeymoon Getaway */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex gap-3 flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md">
                <img src="/images/honeymoon-1.jpg" alt="Luxury resort" className="w-full h-full object-cover" />
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md">
                <img src="/images/honeymoon-2.jpg" alt="Romantic setting" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                Romantic honeymoon getaway escape together with unforgattable moments made just for two.
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                <span className="font-semibold">Recommended destination:</span> bentota (luxury resort) nuwara eliya
                (colonial - style getways) ella (romantic train rides) trincomalee (secluded beache)
              </p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <span className="text-black text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
            </div>
          </div>

          {/* Food & Culture Experience */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex gap-3 flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md">
                <img src="/images/food-1.jpg" alt="Local cuisine" className="w-full h-full object-cover" />
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md">
                <img src="/images/food-2.jpg" alt="Traditional dishes" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                Food & culture experience taste the real sri lanka from steet food to traditional dishes.
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                <span className="font-semibold">Recommended sport:</span> galle fort (cafes), colombo street food tours
                jaffna cuisine experience, kandy culture show.
              </p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <span className="text-black text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
            </div>
          </div>

          {/* Wildlife & Nature Safari */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex gap-3 flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md">
                <img src="/images/wildlife-1.jpg" alt="Safari animals" className="w-full h-full object-cover" />
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md">
                <img src="/images/wildlife-2.jpg" alt="Nature reserve" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                Wildlife &nature safari get wild with nature and see majestic animals in their natural habitat.
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                <span className="font-semibold">Recommended parks:</span> yala national park ,udawalawe, minneriya,
                wilpaththuwa, ksudulla
              </p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-black text-lg">★</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom AI Chat Widget */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[90vw] sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-slideUp">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" 
                alt="Ceyluxe AI" 
                className="w-10 h-10 rounded-full bg-white p-1"
              />
              <div>
                <h3 className="font-bold">Ceyluxe AI</h3>
                <p className="text-xs opacity-90">Your Travel Assistant</p>
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {chatMessages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-cyan-500 text-white rounded-br-none' 
                    : message.isError 
                      ? 'bg-red-100 text-red-800 rounded-bl-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg shadow">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-cyan-500"
                disabled={isChatLoading}
              />
              <button
                onClick={handleChatSend}
                disabled={isChatLoading || !chatInput.trim()}
                className="bg-cyan-500 text-white p-2 rounded-full hover:bg-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChatLoading ? (
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-4 sm:right-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 hover:scale-110"
      >
        {isChatOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}