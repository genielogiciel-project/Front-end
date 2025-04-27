// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Link, useNavigate } from "react-router";



// const AuthLogin = () => {
//   const navigate = useNavigate();
//   const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     console.log(event);
//      navigate("/");
//   }
//   return (
//     <>
//       <form onSubmit={handleSubmit} >
//         <div className="mb-4">
//           <div className="mb-2 block">
//             <Label htmlFor="Username"   >Username</Label>
//           </div>
//           <Input
//             id="Username"
//             type="text"
//             required
//             className="form-control form-rounded-xl"
//           />
//         </div>
//         <div className="mb-4">
//           <div className="mb-2 block">
//             <Label htmlFor="userpwd"  >password</Label>
//           </div>
//           <Input
//             id="userpwd"
//             type="password"
//             required
//             className="form-control form-rounded-xl"
//           />
//         </div>
//         <div className="flex justify-between my-5">
//           <div className="flex items-center gap-2">
//             <Checkbox id="accept" className="checkbox" />
//             <Label
//               htmlFor="accept"
//               className="opacity-90 font-normal cursor-pointer"
//             >
//               Remeber this Device
//             </Label>
//           </div>
//           <Link to={"/"} className="text-primary text-sm font-medium">
//             Forgot Password ?
//           </Link>
//         </div>
//         <Button type="submit" color={"primary"}  className="w-full bg-primary text-white rounded-xl">
//           Sign in
//         </Button>
//       </form>
//     </>
//   );
// };

// export default AuthLogin;
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import SubmitButton from "@__components/submit-button";
// import { Link } from "@__components/ui/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
// import { FcGoogle } from "react-icons/fc";
// import { useToast } from "@/hooks/use-toast";
// import { MdError } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function AuthLogin() {
  const { login, dispatch } = useAuth(false);
  // const { email, password } = useSelector(
  //   (state: RootState) => state.afterRegister
  // );
  // const { toast } = useToast();
  const navigate = useNavigate();

  const formSchema = z.object({
    userNumber: z.string().min(1, { message: "User Number is required" }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userNumber: "00000",
      password: "0",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      meta: { requestStatus },
      payload,
    } = await dispatch(login(values));

    // if (requestStatus === "rejected") {
    //   toast({
    //     variant: "destructive",
    //     title: (
    //       <span className="flex items-center gap-2">
    //         {/* <MdError className="size-5" /> */}
    //         {payload as string}
    //       </span>
    //     ) as any,
    //   });
    // }

    if (requestStatus === "fulfilled") navigate("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-[25rem]"
            >
              <FormField
                control={form.control}
                name="userNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} autoFocus />
                    </FormControl>
                    <FormDescription>
                      Please make sure this is your real username.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please make sure this is your real password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="submit">Submit</Button>
                {/* <SubmitButton isSubmitting={form.formState.isSubmitting} /> */}
                <span className="text-sm">
                  You don&apos;t have an account?
                  {/* <Link to="/register">Sign up</Link> */}
                </span>
              </div>
            </form>
            {/* <Separator className="my-5" /> */}
            {/* <div className="space-y-1.5">
              <Button className="w-full" variant="outline">
                <FcGoogle />
                Sign up with Google
              </Button>
              <Button className="w-full" variant="secondary">
                <FaGithub />
                Sign up with Github
              </Button>
            </div> */}
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
