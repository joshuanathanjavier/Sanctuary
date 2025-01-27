"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Facebook, Instagram, Twitter, Linkedin, Sun, Music, Users, Heart } from "lucide-react"
import SeeMoreParagraph from "@/components/SeeMoreParagraph"

export default function SanctuaryHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const argao = "Argao Psych, the largest private mental health center in Central Luzon, has teamed up with the Sanctuary App to bring expert mental health support directly to your fingertips. Known for their innovative in-clinic and online services, Argao Psych helps shape Sanctuary's features to provide users with tools and resources rooted in real mental health care expertise. With this partnership, Sanctuary users can access thoughtfully designed relaxation programs and wellness tools inspired by Argao Psych's years of experience in counseling, assessments, and workplace wellness. Together, we're creating a platform that truly supports mental well-being, making professional care more accessible and relevant for Filipinos."
  const goddame = "Goddame!3013, a Filipino songwriter and rap artist from Norzagaray, Bulacan, has partnered with the Sanctuary App to contribute original soundscapes and music that enhance the app's relaxationexperience. Through this collaboration, Goddame! provides calming instrumental tracks and soothinglyrical compositions, aligning with the app's mission to deliver curated soundscapes for stress reliefand mental well-being. This partnership brings a unique blend of artistry and therapeutic value,enriching the app's offerings with culturally resonant and emotionally uplifting audio content."

  const slides = [
    {
      image: "/images/1.webp",
      title: "Custom.",
      subtitle: "Soundscapes",
      content:
        "Select calming sounds based on how you're feeling. Whether you want to relax, focus, or reduce stress, Sanctuary creates the perfect sound experience for you.",
    },
    {
      image: "/images/2.webp",
      title: "Expert.",
      subtitle: "Advice",
      content:
        "Get relaxation tips and mental health advice from professionals. Sanctuary blends expert knowledge with sound therapy to help you manage stress more effectively.",
    },
    {
      image: "/images/3.webp",
      title: "Join.",
      subtitle: "The Space",
      content:
        "Connect with others who are also looking to relax and improve their well-being. Sanctuary's community chat lets you share experiences, tips, and encouragement in a safe and supportive environment.",
    },
    {
      image: "/images/4.webp",
      title: "Daily.",
      subtitle: "Reminders",
      content:
        "Set gentle reminders to take breaks and relax during the day. Sanctuary helps you form healthy habits by encouraging regular relaxation sessions.",
    },
    {
      image: "/images/5.webp",
      title: "Easy.",
      subtitle: "To Use",
      content:
        "Access Sanctuary on any device, anytime. It's designed to be simple and easy, so you can enjoy a smooth and relaxing experience no matter where you are.",
    },
    {
      image: "/images/6.webp",
      title: "Relax.",
      subtitle: "Anywhere",
      content:
        "Enjoy peaceful sounds wherever you are. Sanctuary brings nature sounds, music, and white noise to your fingertips, helping you relax anytime you need it.",
    },
  ]

    

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)

    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      clearInterval(interval)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="min-h-screen flex flex-col bg-[#00203FFF] font-medium">
      <header
        className={`fixed top-0 left-0 w-full z-50 px-4 transition-all duration-300 ease-in-out ${
          isScrolled ? "bg-white/90 shadow-md text-black" : "bg-transparent text-white"
        }`}
      >
        <nav className="flex items-center justify-between max-w-6xl mx-auto py-4">
          <Link href="/" className="text-2xl font-bold">
            <Image src="/images/logo.webp" alt="Sanctuary Logo" width={80} height={40} />
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="#homepage" className={`${isScrolled ? "hover:text-green-500" : "hover:text-green-500"}`}>
              Home
            </Link>
            <Link
              href="#aboutpage"
              id="about"
              className={`${isScrolled ? "hover:text-green-500" : "hover:text-green-500"}`}
            >
              About
            </Link>
            <Link href="#how-it-works" className={`${isScrolled ? "hover:text-green-500" : "hover:text-green-500"}`}>
              How It Works
            </Link>
            <Link href="#partners" className={`${isScrolled ? "hover:text-green-500" : "hover:text-green-500"}`}>
              Our Partner
            </Link>
            <Link href="#contact" className={`${isScrolled ? "hover:text-green-500" : "hover:text-green-500"}`}>
              Contact
            </Link>
            <Link href="#pricing" className={`${isScrolled ? "hover:text-green-500" : "hover:text-green-500"}`}>
              Pricing
            </Link>
          </div>
          <Link href="/login" className="hidden md:block">
            <button
              onClick={openModal}
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-white hover:text-green-700 transition duration-300"
            >
              Try It Now
            </button>
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-current">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        {isMenuOpen && (
          <div className="md:hidden bg-white text-black p-4 rounded-lg shadow-lg">
            <Link href="#homepage" className="block py-2">
              Home
            </Link>
            <Link href="#aboutpage" className="block py-2">
              About
            </Link>
            <Link href="#how-it-works" className="block py-2">
              How it works
            </Link>
            <Link href="#partners" className="block py-2">
              Our Partner
            </Link>
            <Link href="#contact" className="block py-2">
              Contact
            </Link>
            <Link href="#pricing" className="block py-2">
              Pricing
            </Link>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <section className="relative h-screen overflow-hidden" id="homepage">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === activeSlide ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={`Slide ${index + 1}`}
                layout="fill"
                objectFit="cover"
                priority
              />
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#edf2f7] via-[#edf2f7]/5 to-transparent" />
              <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black via-[#edf2f7]/5 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center max-w-2xl px-4">
                  <h1 className="text-4xl md:text-7xl font-bold mb-4 text-green-500">
                    {slide.title}
                    <br />
                    <span className="text-3xl md:text-5xl font-semibold text-green-400">{slide.subtitle}</span>
                  </h1>
                  <p className="mb-8 text-base md:text-lg">{slide.content}</p>
                  <Link href="/login">
                    <button
                      onClick={openModal}
                      className="bg-white text-green-900 px-6 py-2 md:px-8 md:py-3 rounded-full text-base md:text-lg font-semibold hover:bg-opacity-90 transition duration-300"
                    >
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-3 h-3 rounded-full ${index === activeSlide ? "bg-white" : "bg-white bg-opacity-50"}`}
              />
            ))}
          </div>
        </section>

        <section className="bg-[#edf2f7] text-gray-800 py-16 min-h-screen relative" id="aboutpage">
        <br/>
        <br/>
        <br/>
          <div className="max-w-6xl mx-auto px-4 my-20">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8 relative">
              <div className="w-full md:w-1/2 z-40">
                <h2 className="text-4xl md:text-5xl font-bold text-left text-green-500 mb-10 md:mb-20">
                  About Sanctuary
                </h2>
                <p className="text-lg md:text-xl leading-7 mb-6">
                  Sanctuary is a relaxing web application designed to create a safe haven for anyone seeking peace,
                  calm, and tranquility. Developed by a group of passionate students, our project embodies our
                  dedication to promoting mental well-being through curated soundscapes, soothing visuals, and
                  user-friendly features.
                  <br />
                  <br />
                  While we are amateur developers, our collective goal is to make a meaningful difference in the lives
                  of our users. Sanctuary is more than just a project; it is a testament to the power of collaboration,
                  creativity, and a shared commitment to mental health. We hope to provide a refuge in the digital world
                  where you can unwind, find focus, and connect with a community that understands your needs.
                </p>
              </div>

              <div className="relative w-full md:w-1/2 h-[400px] sm:h-[500px] lg:h-[600px] z-10">
                <Image
                  src="/images/relax.jpg"
                  alt="Relaxing scene"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-3xl object-center object-cover absolute inset-0"
                />

                <div className="absolute inset-0 bg-gradient-to-l from-[#edf2f7]/0 via-transparent to-[#edf2f7]" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#edf2f7]/0 via-transparent to-[#edf2f7]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#edf2f7]/0 via-transparent to-[#edf2f7]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#edf2f7]/0 via-transparent to-[#edf2f7]" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full z-30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 200"
              className="w-full h-auto"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#34d399" }} />
                  <stop offset="100%" style={{ stopColor: "#3b82f6" }} />
                </linearGradient>
              </defs>
              <path
                fill="url(#waveGradient)"
                d="M0,256L48,213.3C96,171,192,85,288,64C384,43,480,107,576,133.3C672,160,768,160,864,144C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-full z-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="140 50 1240 180"
              className="w-full h-auto"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#34d399" }} />
                  <stop offset="100%" style={{ stopColor: "#3b82f6" }} />
                </linearGradient>
              </defs>
              <path
                fill="url(#waveGradient)"
                d="M0,256L48,213.3C96,171,192,85,288,64C384,43,480,107,576,133.3C672,160,768,160,864,144C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>

        <section className="relative flex-grow mx-auto px-8 py-12 pt-15 bg-[#edf2f7] min-h-screen" id="how-it-works">
          <div className="absolute top-0 left-0 w-full h-[15vh]">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#edf2f7] to-transparent"></div>
          </div>

          <div className="relative pt-28 mx-auto max-w-7xl">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-16 md:mb-24 bg-clip-text text-green-500">
              How It Works
            </h1>

            <div className="grid gap-8 md:gap-14 md:grid-cols-2 lg:grid-cols-3 mb-24">
              <div className="text-left flex flex-col items-start">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-green-500 to-blue-500 text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  <Heart size={28} />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Sign Up</h2>
                <p className="text-gray-700">
                  Create an account with us to personalize your experience and unlock exclusive features.
                </p>
              </div>

              <div className="text-left flex flex-col items-start">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-green-500 to-blue-500 text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  <Users size={28} />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Track Your Mood</h2>
                <p className="text-gray-700">
                  Answer a short questionnaire to track your mood over the past week and see your emotional trends.
                </p>
              </div>

              <div className="text-left flex flex-col items-start">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-green-500 to-blue-500 text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  <Music size={28} />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Listen to Music</h2>
                <p className="text-gray-700">
                  Use our music player to listen to curated soundscapes and genres, recommended based on your mood.
                </p>
              </div>

              <div className="text-left flex flex-col items-start mt-8 md:mt-12">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-green-500 to-blue-500 text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  <Sun size={28} />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Get Personalized Recommendations</h2>
                <p className="text-gray-700">
                  Receive tips and music suggestions tailored to your current emotional state to help you feel better.
                </p>
              </div>

              <div className="text-left flex flex-col items-start mt-8 md:mt-12">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-green-500 to-blue-500 text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  <Sun size={28} />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Customize Your Experience</h2>
                <p className="text-gray-700">
                  Change the app's theme to your preferred style and create a soothing environment that works for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="partners" className="bg-[#edf2f7] text-gray-800 py-16 min-h-screen relative">
        <br/>
          <div className="absolute top-0 left-0 w-full z-10 transform rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 200"
              className="w-full h-auto"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#34d399" }} />
                  <stop offset="100%" style={{ stopColor: "#3b82f6" }} />
                </linearGradient>
              </defs>
              <path
                fill="url(#waveGradient)"
                d="M0,256L48,213.3C96,171,192,85,288,64C384,43,480,107,576,133.3C672,160,768,160,864,144C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div className="absolute top-0 left-0 w-full z-0 transform rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="140 50 1240 180"
              className="w-full h-auto"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#34d399" }} />
                  <stop offset="100%" style={{ stopColor: "#3b82f6" }} />
                </linearGradient>
              </defs>
              <path
                fill="url(#waveGradient)"
                d="M0,256L48,213.3C96,171,192,85,288,64C384,43,480,107,576,133.3C672,160,768,160,864,144C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div className="max-w-6xl mx-auto px-4 mt-20">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-green-500 mb-8 md:mb-12">Our Partners</h2>
            <p className="text-center text-lg md:text-xl mb-8 md:mb-12">
              We are proud to collaborate with organizations that share our commitment to mental health and well-being.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
                <Image
                  src="/images/argao-logo2.webp"
                  alt="Argao Psych Logo"
                  width={200}
                  height={200}
                  className="mb-12 md:mb-20 mt-8 md:mt-12"
                />
                <h3 className="font-bold text-xl text-green-500 mb-8 md:mb-12">Argao Psych</h3>
                <div className="text-justify text-gray-700 mx-4 md:mx-12">
                <SeeMoreParagraph text={argao} maxlength={250}/>
                </div>
                <div className="flex flex-col items-center mt-8 md:mt-11">
                  <a
                    href="https://argaopsych.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 font-semibold hover:underline mb-4 md:mb-6 text-lg"
                  >
                    Visit them at
                  </a>
                  <div className="flex space-x-4 mb-4 md:mb-6">
                    <a
                      href="https://www.facebook.com/argaopsych"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-green-500 px-2 md:px-4"
                    >
                      <Facebook size={24} />
                    </a>
                    <a
                      href="https://x.com/argaopsych"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-green-500 px-2 md:px-4"
                    >
                      <Twitter size={24} />
                    </a>
                    <a
                      href="https://www.instagram.com/argaopsych/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-green-500 px-2 md:px-4"
                    >
                      <Instagram size={24} />
                    </a>
                    <a
                      href="https://www.youtube.com/@argaopsych"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-green-500 px-2 md:px-4"
                    >
                      <svg className="h-6 w-6 md:h-8 md:w-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186c-.26-1.48-1.565-2.625-3.067-2.824C17.894 3 12 3 12 3s-5.894 0-8.43.362c-1.502.199-2.808 1.344-3.067 2.824C.094 8.63 0 12 0 12s.094 3.37.503 5.814c.259 1.48 1.565 2.625 3.067 2.824C6.106 21 12 21 12 21s5.894 0 8.43-.362c1.502-.199 2.808-1.344 3.067-2.824C23.906 15.37 24 12 24 12s-.094-3.37-.502-5.814zM9.546 15.568V8.432l6.182 3.568-6.182 3.568z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
                <Image
                  src="/images/goddame-logo.webp"
                  alt="Goddame!3013 Logo"
                  width={200}
                  height={200}
                  className="rounded-full mb-5"
                />
                <h3 className="font-bold text-xl text-green-500 mb-8 md:mb-12">Goddame!3013</h3>
                <div className="text-justify text-gray-700 mx-4 md:mx-12">
                  <SeeMoreParagraph text={goddame} maxlength={120}/>
                </div>
                <div className="flex flex-col items-center mt-16 md:mt-28 mb-4 md:mb-6">
                  <a
                    href="https://www.youtube.com/@goddame3013"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 font-semibold hover:underline mb-4 md:mb-6 text-lg"
                  >
                    Follow them at
                  </a>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.facebook.com/fredoromantiko"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-green-500 px-2 md:px-4"
                    >
                      <Facebook size={24} />
                    </a>
                    <a
                      href="https://www.instagram.com/goddame3013?igsh=NGJjOWY0MDl5NHc3"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-green-500 px-2 md:px-4"
                    >
                      <Instagram size={24} />
                    </a>
                    <a
                      href="https://www.youtube.com/@goddame3013"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-green-500 px-2 md:px-4"
                    >
                      <svg className="h-6 w-6 md:h-8 md:w-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186c-.26-1.48-1.565-2.625-3.067-2.824C17.894 3 12 3 12 3s-5.894 0-8.43.362c-1.502.199-2.808 1.344-3.067 2.824C.094 8.63 0 12 0 12s.094 3.37.503 5.814c.259 1.48 1.565 2.625 3.067 2.824C6.106 21 12 21 12 21s5.894 0 8.43-.362c1.502-.199 2.808-1.344 3.067-2.824C23.906 15.37 24 12 24 12s-.094-3.37-.502-5.814zM9.546 15.568V8.432l6.182 3.568-6.182 3.568z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#edf2f7] min-h-screen relative flex-grow mx-auto px-6 py-12" id="contact">
        <br/>
        <br/>
        <br/>
          <div className="rounded-lg p-8 md:p-10 text-green-500 shadow-md bg-white max-w-xl mx-auto mt-20 md:mt-28 z-20 relative">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8">Contact Us</h2>
            <p className="text-base md:text-lg text-center mb-6 text-black">
              Have questions or feedback? Reach out to us through the following channels!
            </p>

            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold mt-8 md:mt-10 mb-2">Email Us</h3>
                <p>
                  <a href="mailto:amateuristictechs@gmail.com" className="underline font-semibold text-black">
                    amateuristictechs@gmail.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-semibold mt-8 md:mt-10 mb-2">Call Us</h3>
                <p>
                  <a href="tel:+639213600941" className="underline font-semibold text-black">
                    +63 921 360 0941
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-semibold mt-8 md:mt-10 mb-2 text-center">Follow Us</h3>
                <div className="flex justify-center space-x-6 md:space-x-10">
                  <a
                    href="https://www.facebook.com/profile.php?id=61565691582856"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-500 px-2 md:px-4"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href="https://x.com/SanctuaryRelax?t=4jsvYk5SsXxLgcT0d4apTA&s=09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-500 px-2 md:px-4"
                  >
                    <Twitter size={24} />
                  </a>
                  <a
                    href="https://www.instagram.com/immugii?igsh=MXg0bWpxMWVqbHVvYg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-500 px-2 md:px-4"
                  >
                    <Instagram size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full z-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="140 50 1240 180"
              className="w-full h-auto"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#34d399" }} />
                  <stop offset="100%" style={{ stopColor: "#3b82f6" }} />
                </linearGradient>
              </defs>
              <path
                fill="url(#waveGradient)"
                d="M0,256L48,213.3C96,171,192,85,288,64C384,43,480,107,576,133.3C672,160,768,160,864,144C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 200"
              className="w-full h-auto"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#34d399" }} />
                  <stop offset="100%" style={{ stopColor: "#3b82f6" }} />
                </linearGradient>
              </defs>
              <path
                fill="url(#waveGradient)"
                d="M0,256L48,213.3C96,171,192,85,288,64C384,43,480,107,576,133.3C672,160,768,160,864,144C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>
      </main>

      <section id="pricing" className="bg-[#edf2f7] py-16 relative">
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-green-500 mb-8">Sanctuary Pricing Plans</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Free Account</h3>
              <p className="text-xl font-semibold mb-4">₱0 - Free Forever</p>
              <p className="mb-4">Enjoy unlimited access to all current features:</p>
              <ul className="list-none space-y-2 mb-6">
                <li>🌟 Full library of soundscapes and songs.</li>
                <li>📊 Mood Tracker and Mood Chart.</li>
                <li>🎵 Personalized song recommendations.</li>
                <li>🔍 Search and Like your favorite songs.</li>
                <li>🎨 Theme customization options.</li>
                <li>🚫 Completely ad-free.</li>
              </ul>
              <p className="mb-6">Start your relaxation journey at no cost!</p>
              <Link href="/login">
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300">
                  Get Started
                </button>
              </Link>
            </div>
            {/* Premium Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Premium Account</h3>
              <p className="text-xl font-semibold mb-4">₱149/month or ₱1,499/year</p>
              <p className="mb-4">Take your Sanctuary experience to the next level with exclusive access to:</p>
              <ul className="list-none space-y-2 mb-6">
                <li>🚀 New and advanced features as they're released.</li>
                <li>🛠 Priority support for your inquiries.</li>
                <li>🎉 Early access to upcoming enhancements and premium content.</li>
              </ul>
              <p className="text-red-500 mb-6">Coming soon! Not yet available.</p>
              <button disabled className="w-full bg-gray-300 text-gray-600 px-4 py-2 rounded-full cursor-not-allowed">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
      </section>

      <footer className="bg-[#010e25] text-white py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <div className="text-left px-4 md:px-8">
              <p className="mb-4 text-center">
                Sanctuary is your trusted companion for stress relief and relaxation. Immerse yourself in curated
                soundscapes designed to enhance focus, promote calm, and uplift your well-being.
              </p>
              <div className="flex justify-center space-x-6">
                <a
                  href="https://www.facebook.com/profile.php?id=61565691582856"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-green-500 transition duration-300"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://x.com/SanctuaryRelax?t=4jsvYk5SsXxLgcT0d4apTA&s=09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-green-500 transition duration-300"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://www.instagram.com/immugii?igsh=MXg0bWpxMWVqbHVvYg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-green-500 transition duration-300"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            <div>
              <h6 className="font-semibold text-lg mb-4">Quick Links</h6>
              <ul className="space-y-2">
                <li>
                  <Link href="#homepage" className="hover:text-green-500 transition duration-300">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#aboutpage" className="hover:text-green-500 transition duration-300">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-green-500 transition duration-300">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#partners" className="hover:text-green-500 transition duration-300">
                    Our Partners
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-green-500 transition duration-300">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold text-lg mb-4">Help & Support</h6>
              <ul className="space-y-2">
                <li>
                  <Link href="/documents/Privacy-Policy_Sanctuary.pdf" target="_blank" className="hover:text-green-500 transition duration-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/documents/Terms-and-Conditions_Sanctuary.pdf" target="_blank" className="hover:text-green-500 transition duration-300">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center w-full">
            <p>
              Design and Developed by{" "}
              <a href="#" className="text-green-500 hover:underline">
                AmateuristicTechs
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

