'use client'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    email: z.string({
        required_error: "Email é necessario!"}).email({
            message: "Email não é valido!"
        }),
    password: z.string({
        required_error: "Senha é necessario!"
    }).min(6, {
        message: "Senha deve ter no minimo 6 caracteres!"
    })
})

export function LoginAccountForm(){
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });


    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        try {
            const supabase = createClientComponentClient();
            const { email, password } = values;
            const {error, data: { session }} = await supabase.auth.signInWithPassword({
                email,
                password
            })
            form.reset();
            router.refresh();
        } catch (error) {
            console.log("login-form: onsubmit",error)
        }
    }

    return(
        <div className="flex flex-col justify-center items-center space-y-2">
            <span className="text-lg">Faça seu login</span>
            <Form {...form}>
                <form 
                    className="flex flex-col space-y-2"
                    onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field})=> (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Seu E-mail"
                                            {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field})=> (
                                <FormItem>
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Sua Senha"
                                            {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    <Button type="submit">Login</Button>

                </form>
            </Form>
        </div>
    )
}