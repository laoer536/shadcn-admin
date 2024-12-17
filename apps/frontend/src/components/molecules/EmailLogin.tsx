import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { server } from '@/lib/server'

export const description = "A simple login form with email and password. The submit button says 'Sign in'."

export function EmailLogin() {
  const [isVerificationCodeMode, setIsVerificationCodeMode] = useState(true)
  const emailInputRef = useRef<HTMLInputElement | null>(null)
  const verificationCodeInputRef = useRef<HTMLInputElement | null>(null)
  const { toast } = useToast()

  const getAllFormValues = () => {
    const email = emailInputRef.current?.value
    const verificationCode = verificationCodeInputRef.current?.value
    return { email, verificationCode }
  }
  const onGetVerificationCode = async () => {
    const { email } = getAllFormValues()
    if (email) {
      const { error } = await server.authority.get_verification_code.post({ email })
      if (!error) {
        toast({
          title: 'tips',
          description: 'Successfully obtained the login verification code, please go to your email to check!',
        })
        setIsVerificationCodeMode(false)
      } else {
        toast({ title: 'tips', description: `${error?.value || 'Failed to obtain the login verification code.'}` })
      }
    }
  }

  const onSubmit = async () => {
    const { email, verificationCode } = getAllFormValues()
    if (email && verificationCode) {
      const { data: token, error } = await server.authority.login.post({ email, verificationCode })
      if (!error) {
        localStorage.setItem('token', token)
        location.reload()
      }
    }
  }
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">
          <img src="https://elysiajs.com/assets/elysia.svg" alt="elysia" />
          Login Bun+Elysia+Prisma+React+Tailwindcss
        </CardTitle>
        <CardDescription>Enter your email below to login to your account.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required ref={emailInputRef} />
        </div>
        {!isVerificationCodeMode && (
          <div className="grid gap-2">
            <Label htmlFor="verificationCode">Login verification code</Label>
            <Input id="verificationCode" type="text" required ref={verificationCodeInputRef} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isVerificationCodeMode ? (
          <Button className="w-full" onClick={onGetVerificationCode}>
            Get a login verification code
          </Button>
        ) : (
          <Button onClick={onSubmit} className="w-full">
            Sign in
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
