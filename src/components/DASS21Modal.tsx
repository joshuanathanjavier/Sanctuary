"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { questions, questionsdesc } from "@/constants"
import type { DASSScores } from "@/types"

type DASS21ModalProps = {
  isOpen: boolean
  onCloseAction: () => void
  onSubmitAction: (scores: DASSScores) => void
  isReminder?: boolean
}

export default function DASS21Modal({ isOpen, onCloseAction, onSubmitAction }: DASS21ModalProps) {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const calculateScores = () => {
    const scores = { depression: 0, anxiety: 0, stress: 0 }
    questions.forEach((question) => {
      const score = answers[question.id] || 0
      if (question.type === "d") scores.depression += score
      if (question.type === "a") scores.anxiety += score
      if (question.type === "s") scores.stress += score
    })
    scores.depression *= 2
    scores.anxiety *= 2
    scores.stress *= 2
    onSubmitAction(scores)
    onCloseAction()
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateScores()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const currentQuestionData = questions[currentQuestion]
  const currentQuestionDesc = questionsdesc[currentQuestion]

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 text-gray-800 dark:text-gray-200 [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold text-center mb-4">Mood Tracker</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 md:space-y-8">
          <p className="mb-4 md:mb-6 text-center text-sm md:text-base">
            Please answer the following questions honestly to determine your current state. This mood tracker contains
            21 questions about your <b>Mental Health</b> over the past week, helping you track your mood and see how it
            changes.
          </p>
          <div>
            <p className="text-base md:text-lg font-bold">{currentQuestionData.text}</p>
            <p className="mb-4 text-xs md:text-sm text-gray-500">{currentQuestionDesc.text}</p>
            <RadioGroup
              onValueChange={(value) => handleAnswer(currentQuestionData.id, Number.parseInt(value))}
              value={answers[currentQuestionData.id]?.toString() ?? ""}
            >
              {[0, 1, 2, 3].map((value) => (
                <div key={value} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={value.toString()} id={`q${currentQuestionData.id}-${value}`} />
                  <Label htmlFor={`q${currentQuestionData.id}-${value}`} className="text-xs md:text-sm">
                    {value === 0 && "Did not apply to me at all"}
                    {value === 1 && "Applied to me to some degree, or some of the time"}
                    {value === 2 && "Applied to me to a considerable degree or a good part of time"}
                    {value === 3 && "Applied to me very much or most of the time"}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <div className="mt-6">
          <Progress value={progress} className="w-full mb-4" />
          <div className="flex justify-between">
            <Button onClick={handlePrevious} disabled={currentQuestion === 0} className="text-sm md:text-base">
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={answers[currentQuestionData.id] === undefined}
              className={`text-sm md:text-base ${currentQuestion === questions.length - 1 ? "bg-green-600 hover:bg-green-700" : ""}`}
            >
              {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

