"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Loader, PartyPopper } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { submitQuiz } from "./lista-espera/actions"
import Link from "next/link"

const quizSchema = z.object({
  role: z.string().min(1, "Selecione seu cargo"),
  challenge: z.string().min(1, "Selecione seu maior desafio"),
  companySize: z.string().min(1, "Selecione o tamanho da sua empresa"),
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
})

type QuizFormData = z.infer<typeof quizSchema>

const questions = [
  {
    id: "role",
    question: "Qual é o seu cargo principal?",
    options: ["Fundador(a) / C-Level", "Marketing", "Vendas", "Desenvolvedor(a)", "Outro"],
  },
  {
    id: "challenge",
    question: "Qual seu maior desafio hoje?",
    options: [
      "Baixa taxa de conversão",
      "Custo de aquisição (CAC) muito alto",
      "Entender o comportamento do usuário",
      "Otimizar o funil de vendas",
      "Escalar as operações",
    ],
  },
  {
    id: "companySize",
    question: "Qual o tamanho da sua equipe?",
    options: ["Eu sozinho(a)", "2-10 pessoas", "11-50 pessoas", "51-200 pessoas", "Mais de 200 pessoas"],
  },
]

export function QuizForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const methods = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      role: "",
      challenge: "",
      companySize: "",
      name: "",
      email: "",
    },
  })

  const { handleSubmit, trigger, getFieldState, formState } = methods

  const nextStep = async () => {
    const fieldName = questions[currentStep]?.id as keyof QuizFormData
    const isValid = await trigger(fieldName)
    if (isValid) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const onSubmit = async (data: QuizFormData) => {
    setIsSubmitting(true)
    try {
      await submitQuiz(data)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Submission failed", error)
      // Aqui você pode adicionar um toast de erro
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (currentStep / (questions.length + 1)) * 100

  if (isSubmitted) {
    return (
      <Card className="w-full border-primary/30 bg-secondary/50 shadow-[0_0_80px_hsl(var(--primary)/0.15)] backdrop-blur-xl">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <PartyPopper className="mx-auto h-16 w-16 text-primary mb-4" />
            <h2 className="text-3xl font-bold font-display text-foreground">Você está na lista!</h2>
            <p className="mt-2 text-muted-foreground">
              Obrigado! Você deu o primeiro passo para congelar sua concorrência. Entraremos em contato em breve.
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Voltar para o Início</Link>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full border-primary/30 bg-secondary/50 shadow-[0_0_80px_hsl(var(--primary)/0.15)] backdrop-blur-xl">
          <CardHeader>
            <Progress value={progress} className="mb-4" />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <CardTitle className="text-2xl font-display">
                  {currentStep < questions.length
                    ? questions[currentStep].question
                    : "Quase lá! Conte-nos quem você é."}
                </CardTitle>
              </motion.div>
            </AnimatePresence>
          </CardHeader>
          <CardContent className="min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {currentStep < questions.length && (
                  <RadioGroup
                    name={questions[currentStep].id}
                    onValueChange={(value) => methods.setValue(questions[currentStep].id as keyof QuizFormData, value)}
                    defaultValue={methods.getValues(questions[currentStep].id as keyof QuizFormData)}
                  >
                    <div className="space-y-3">
                      {questions[currentStep].options.map((option) => (
                        <RadioGroupItem key={option} value={option} id={option} className="peer sr-only" />
                      ))}
                      {questions[currentStep].options.map((option) => (
                        <Label
                          key={`label-${option}`}
                          htmlFor={option}
                          className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          {option}
                        </Label>
                      ))}
                    </div>
                    {formState.errors[questions[currentStep].id as keyof QuizFormData] && (
                      <p className="text-sm font-medium text-destructive mt-2">
                        {formState.errors[questions[currentStep].id as keyof QuizFormData]?.message}
                      </p>
                    )}
                  </RadioGroup>
                )}
                {currentStep === questions.length && (
                  <div className="space-y-4">
                    <Input
                      {...methods.register("name")}
                      placeholder="Seu nome completo"
                      className="h-12 bg-background"
                    />
                    {formState.errors.name && (
                      <p className="text-sm font-medium text-destructive">{formState.errors.name.message}</p>
                    )}
                    <Input
                      {...methods.register("email")}
                      placeholder="Seu melhor e-mail"
                      className="h-12 bg-background"
                    />
                    {formState.errors.email && (
                      <p className="text-sm font-medium text-destructive">{formState.errors.email.message}</p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-between">
            {currentStep > 0 ? (
              <Button type="button" variant="ghost" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            ) : (
              <div />
            )}
            {currentStep < questions.length ? (
              <Button type="button" onClick={nextStep}>
                Avançar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Entrar na Lista de Espera"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}
