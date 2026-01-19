"use client"

import React from "react"
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  QuadraticBezierCurve3,
  Vector3,
  TubeGeometry,
  ShaderMaterial,
  Mesh,
  AdditiveBlending,
  DoubleSide,
} from "three"
import type { ReactElement } from "react"
import { useState, useEffect, useRef } from "react"
import { Github, Linkedin, Loader2 } from "lucide-react"

// Modern X (Twitter) Logo
const XLogo = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
  </svg>
)

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"

export function WaitlistExperience(): ReactElement {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Scene | null>(null)
  const rendererRef = useRef<WebGLRenderer | null>(null)
  const animationIdRef = useRef<number | null>(null)

  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Three.js background effect
  useEffect(() => {
    const currentMount = mountRef.current
    if (!currentMount) return

    // Scene setup
    const scene = new Scene()
    sceneRef.current = scene

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    rendererRef.current = renderer

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1)
    currentMount.appendChild(renderer.domElement)

    // Create curved light geometry
    const curve = new QuadraticBezierCurve3(new Vector3(-15, -4, 0), new Vector3(2, 3, 0), new Vector3(18, 0.8, 0))

    // Create tube geometry for the light streak
    const tubeGeometry = new TubeGeometry(curve, 200, 0.8, 32, false)

    // Create gradient material
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Create the gradient from red/orange to purple/magenta
        vec3 color1 = vec3(1.0, 0.2, 0.1); // Red/Orange
        vec3 color2 = vec3(0.8, 0.1, 0.6); // Purple/Magenta
        vec3 color3 = vec3(0.4, 0.05, 0.8); // Deep purple
        
        // Mix colors based on UV coordinates
        vec3 finalColor = mix(color1, color2, vUv.x);
        finalColor = mix(finalColor, color3, vUv.x * 0.7);
        
        // Add glow effect
        float glow = 1.0 - abs(vUv.y - 0.5) * 2.0;
        glow = pow(glow, 2.0);
        
        float fade = 1.0;
        if (vUv.x > 0.85) {
          fade = 1.0 - smoothstep(0.85, 1.0, vUv.x);
        }
        
        // Add subtle animation
        float pulse = sin(time * 2.0) * 0.1 + 0.9;
        
        gl_FragColor = vec4(finalColor * glow * pulse * fade, glow * fade * 0.8);
      }
    `

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
      },
      transparent: true,
      blending: AdditiveBlending,
      side: DoubleSide,
    })

    const lightStreak = new Mesh(tubeGeometry, material)
    scene.add(lightStreak)

    // Add additional glow layers for more realistic effect
    const glowGeometry = new TubeGeometry(curve, 200, 1.5, 32, false)
    const glowMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec3 color1 = vec3(1.0, 0.3, 0.2);
          vec3 color2 = vec3(0.6, 0.2, 0.8);
          
          vec3 finalColor = mix(color1, color2, vUv.x);
          
          float glow = 1.0 - abs(vUv.y - 0.5) * 2.0;
          glow = pow(glow, 4.0);
          
          float fade = 1.0;
          if (vUv.x > 0.85) {
            fade = 1.0 - smoothstep(0.85, 1.0, vUv.x);
          }
          
          float pulse = sin(time * 1.5) * 0.05 + 0.95;
          
          gl_FragColor = vec4(finalColor * glow * pulse * fade, glow * fade * 0.3);
        }
      `,
      uniforms: {
        time: { value: 0 },
      },
      transparent: true,
      blending: AdditiveBlending,
      side: DoubleSide,
    })

    const glowLayer = new Mesh(glowGeometry, glowMaterial)
    scene.add(glowLayer)

    // Position camera
    camera.position.z = 7
    camera.position.y = -0.8

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001
      material.uniforms.time.value = time
      glowMaterial.uniforms.time.value = time

      // Subtle rotation for dynamic effect
      lightStreak.rotation.z = Math.sin(time * 0.2) * 0.05
      glowLayer.rotation.z = Math.sin(time * 0.2) * 0.05

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement)
      }

      renderer.dispose()
      tubeGeometry.dispose()
      glowGeometry.dispose()
      material.dispose()
      glowMaterial.dispose()
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    // Set target date to February 18, 2026 (30 days from Jan 19)
    const targetDate = new Date("2026-02-18T00:00:00").getTime()

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      }
    }

    // Set initial time
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft()
      setTimeLeft(remaining)
      
      if (Object.values(remaining).every(v => v === 0)) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Failed to join waitlist. Please try again.")
      }

      setIsSubmitted(true)
      console.log("Email submitted:", email)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black w-full font-sans">
      {/* Three.js Background */}
      <div ref={mountRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }} />

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen">
        {/* Waitlist Card */}
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="relative">
            <div className="relative backdrop-blur-xl bg-black/60 border border-white/20 rounded-xl p-8 w-[400px] shadow-2xl ring-1 ring-white/10">
              <div className="absolute inset-0 rounded-xl bg-linear-to-br from-white/10 to-transparent pointer-events-none" />

              <div className="relative z-10">
                {!isSubmitted ? (
                  <>
                    <div className="mb-8 text-center">
                      <div className="inline-block px-3 py-1 mb-4 text-[9px] font-bold tracking-[0.2em] text-white/90 uppercase bg-white/10 border border-white/30 rounded-md">
                        Under Maintenance
                      </div>
                      <h1 className="text-4xl font-light text-white mb-4 tracking-tight"> enterx </h1>
                      <p className="text-white/70 text-[13px] leading-relaxed">
                        We&apos;re currently maintaining our platform to bring you better features and improved performance. 
                        Please wait while we work on making everything even better for you.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mb-4">
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="Enter your email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isLoading}
                          className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10 h-11 rounded-lg backdrop-blur-sm disabled:opacity-50"
                        />
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="h-11 px-5 bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xs font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 border-0 disabled:opacity-50 min-w-[100px]"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Notify Me"}
                        </Button>
                      </div>
                    </form>

                    {error && (
                      <p className="mb-4 text-center text-red-400 text-[11px] font-medium">
                        {error}
                      </p>
                    )}

                    <div className="flex items-center justify-center gap-6 text-center mb-10">
                      <div>
                        <div className="text-2xl font-light text-white"> {timeLeft.days} </div>
                        <div className="text-[9px] text-white/60 uppercase tracking-widest"> days </div>
                      </div>
                      <div className="text-white/20 text-xl font-thin">|</div>
                      <div>
                        <div className="text-2xl font-light text-white"> {timeLeft.hours} </div>
                        <div className="text-[9px] text-white/60 uppercase tracking-widest"> hours </div>
                      </div>
                      <div className="text-white/20 text-xl font-thin">|</div>
                      <div>
                        <div className="text-2xl font-light text-white"> {timeLeft.minutes} </div>
                        <div className="text-[9px] text-white/60 uppercase tracking-widest"> minutes </div>
                      </div>
                      <div className="text-white/20 text-xl font-thin">|</div>
                      <div>
                        <div className="text-2xl font-light text-white"> {timeLeft.seconds} </div>
                        <div className="text-[9px] text-white/60 uppercase tracking-widest"> seconds </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-6 pt-8 border-t border-white/5">
                      <a href="https://github.com/BashirMohamedAli" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors duration-300">
                        <Github size={18} />
                      </a>
                      <a href="https://www.linkedin.com/in/mrbashirx/" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors duration-300">
                        <Linkedin size={18} />
                      </a>
                      <a href="https://x.com/mrbashirx" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors duration-300">
                        <XLogo size={18} />
                      </a>
                    </div>
                    
                    <p className="mt-10 text-center text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium">
                      © 2026 enterx. All rights reserved.
                    </p>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-linear-to-r from-green-500/20 to-emerald-600/20 flex items-center justify-center border border-green-500/30">
                      <svg
                        className="w-7 h-7 text-green-400 drop-shadow-lg"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 tracking-tight"> You&apos;re on the list!</h3>
                    <p className="text-white/50 text-[13px] leading-relaxed">
                      We&apos;ll notify you when enterx is back online. Thank you for your patience!
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="mt-6 text-[11px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest"
                    >
                      Back
                    </button>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 rounded-xl bg-linear-to-t from-transparent via-white/2 to-white/5 pointer-events-none" />
            </div>

            <div className="absolute inset-0 rounded-xl bg-linear-to-r from-red-500/10 to-purple-600/10 blur-2xl scale-110 -z-10" />
          </div>
        </div>
      </div>
    </main>
  )
}
