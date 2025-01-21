"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { words } from "@/lib/wordsDB"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

function generateText(length: number): string {
    return Array(length)
        .fill(0)
        .map(() => words[Math.floor(Math.random() * words.length)])
        .join(" ")
}

export default function TypingTest() {
    const secondCircle = useRef<SVGCircleElement>(null);
    const [text, setText] = useState("")
    const [userInput, setUserInput] = useState("")
    const [startTime, setStartTime] = useState<number | null>(null)
    const [timeLeft, setTimeLeft] = useState(60)
    const [isActive, setIsActive] = useState(false)
    const [results, setResults] = useState({ wpm: 0, accuracy: 0 })
    
    const inputRef = useRef<HTMLInputElement>(null)

    const startTest = useCallback(() => {
        setText(generateText(10))
        setUserInput("")
        setStartTime(null)
        setTimeLeft(60)
        setIsActive(false)
        setResults({ wpm: 0, accuracy: 0 })
    }, [])

    const endTest = useCallback(() => {
        setIsActive(false)
        if (startTime) {
            const totalTime = (Date.now() - startTime) / 1000 / 60
            const charactersTyped = userInput.length
            const wpm = Math.round(charactersTyped / 5 / totalTime)

            const accuracy = calculateAccuracy(text, userInput)
            setResults({ wpm, accuracy })
        }
    }, [startTime, text, userInput])

    useEffect(() => {
        let interval: NodeJS.Timeout;
    
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
                
                secondCircle.current!.style.strokeDashoffset = `${
                    timeLeft > 0 ? 451 - (timeLeft * 451) / 60 : 451
                  }px`;
            }, 1000);
        } else if (timeLeft === 0) {
            endTest();
        }
    
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);
    useEffect(() => {
        if (!isActive && startTime === null) {
            setStartTime(Date.now());
            setIsActive(true);
        }
    }, [isActive, startTime]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
        if (!isActive && inputValue.length === 1) {
            setIsActive(true)
            setStartTime(Date.now())
        }
        setUserInput(inputValue)


        if (inputValue.length >= text.length - 20) {
            setText((prevText) => prevText + " " + generateText(5))
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            e.preventDefault()
        }
    }

    const calculateAccuracy = (original: string, typed: string) => {
        let correctKeystrokes = 0
        for (let i = 0; i < typed.length; i++) {
            if (typed[i] === original[i]) {
                correctKeystrokes++
            }
        }
        return Math.round((correctKeystrokes / typed.length) * 100)
    }

    useEffect(() => {
        startTest()
    }, [startTest])

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [text])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-cover bg-center" style={{backgroundImage:"url('https://as2.ftcdn.net/v2/jpg/01/67/40/25/1000_F_167402577_bxdrYiPsFRTry60Zx40Iig3ybsD3SzNt.jpg')"}}>
            <Card className="w-4/5 h-full bg-white-700 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-35 border border-gray-100">
                <CardHeader>
                    <h2 className="text-xl text-center">Dynamic Typing Speed Test</h2>
                    <h1 className="text-6xl text-center font-extrabold">Test your typing skill </h1>
                    {!isActive && !startTime && <p className="text-xl text-center text-green-500 font-bold">Start typing to begin</p>}

                </CardHeader>
                <CardContent>
                    <div className=" w-full h-full pointer-events-none overflow-hidden">
                        {text.split("").map((char, index) => (
                            <span
                                key={index}
                                className={`${index < userInput.length
                                        ? userInput[index] === char
                                            ? "text-green-500"
                                            : "text-red-500"
                                        : "text-gray-700"
                                    }`}
                            >
                                {char}
                            </span>
                        ))}
                    </div>
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={userInput}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Start typing to begin"
                            className="w-full p-2 border rounded break-words text-wrap"
                            disabled={!text || timeLeft === 0}
                        />

                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="relative">
                        <svg className="-rotate-90 h-48 w-48">
                        <circle
                            r="70"
                            cx="90"
                            cy="90"
                            className="fill-transparent stroke-[#353536] stroke-[8px]"
                        ></circle>
                        <circle
                            r="70"
                            cx="90"
                            cy="90"
                            className=" fill-transparent stroke-white  stroke-[8px]"
                            ref={secondCircle}
                            style={{
                            strokeDasharray: "451px",
                            }}
                        ></circle>
                        </svg>
                        <div className="text-gray-800 absolute top-16 left-11 text-2xl font-semibold flex flex-col items-center w-24 h-20">
                        <span className="text-center">{timeLeft}</span>
                        <span className="text-center">
                            Seconds
                        </span>
                        </div>
                    </div>
                    <div className="relative">
                        <svg className="-rotate-90 h-48 w-48">
                        <circle
                            r="70"
                            cx="90"
                            cy="90"
                            className="fill-transparent stroke-[#353536] stroke-[8px]"
                        ></circle>
                        <circle
                            r="70"
                            cx="90"
                            cy="90"
                            className=" fill-transparent stroke-white  stroke-[8px]"
                            
                        ></circle>
                        </svg>
                        <div className="text-gray-800 absolute top-16 left-11 text-2xl font-semibold flex flex-col items-center w-24 h-20">
                        <span className="text-center">{results.wpm}</span>
                        <span className="text-center text-m">
                        words/min
                        </span>
                        </div>
                    </div>
                    <div className="relative">
                        <svg className="-rotate-90 h-48 w-48">
                        <circle
                            r="70"
                            cx="90"
                            cy="90"
                            className="fill-transparent stroke-[#353536] stroke-[8px]"
                        ></circle>
                        <circle
                            r="70"
                            cx="90"
                            cy="90"
                            className=" fill-transparent stroke-white  stroke-[8px]"
                            
                        ></circle>
                        </svg>
                        <div className="text-gray-800 absolute top-16 left-11 text-2xl font-semibold flex flex-col items-center w-24 h-20">
                        <span className="text-center">{results.accuracy}%</span>
                        <span className="text-center">
                        Accuracy
                        </span>
                        </div>
                    </div>
                    <div className="relative">
                    <Link href="/" className="cursor-pointer">

                        <svg className="-rotate-90 h-48 w-48 ">
                        <circle
                            r="70"
                            cx="90"
                            cy="90"
                            className="fill-[#353536] stroke-[#353536] stroke-[8px]"
                        ></circle>
                        <circle
                            r="70"
                            cx="90"
                            cy="90"
                            className=" fill-transparent stroke-white  stroke-[8px] "
                            
                        ></circle>
                        </svg>
                        <div className="text-gray-400  absolute top-16 left-11 text-2xl font-semibold flex flex-col items-center justify-center w-24 h-20">
                            <span className="text-center">
                            Retry
                            </span>
                        </div>
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

