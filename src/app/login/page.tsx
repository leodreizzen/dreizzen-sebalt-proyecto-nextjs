import { Button } from "@nextui-org/button";
import { MdAlternateEmail } from "react-icons/md";
import { PiKey } from "react-icons/pi";

export default function LoginPage() {
    async function handleSubmit(){
        "use server"
    }
    return (
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center">
                <div className="h-24 w-24 inline-block mx-auto bg-content1">
                    INSERTE LOGO
                </div>
                <h1 className="text-3xl font-bold text-center mt-5 mb-4">Iniciar sesión</h1>
                <div className="flex flex-col items-center">
                    <form className="flex w-80 flex-col border border-borders items-start bg-content1 px-10 py-4 rounded-xl" action={handleSubmit}>
                        <label htmlFor="email">Email</label>
                        <div className="flex items-center mt-1 relative w-full">
                            <input name="email" type="email" autoComplete="username" className="peer text-black block w-full rounded-md border border-gray-200 py-[9px] pl-8 text-sm outline-2 placeholder:text-gray-500" />
                            <MdAlternateEmail className="pointer-events-none absolute left-2 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>

                        <label htmlFor="password" className="mt-4">Contraseña</label>
                        <div className="flex items-center mt-1 relative w-full">
                            <input name="password" type="password" autoComplete="current-password" className="peer text-black block w-full rounded-md border border-gray-200 py-[9px] pl-8 text-sm outline-2 placeholder:text-gray-500" />
                            <PiKey  className="pointer-events-none absolute left-2 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        <Button type="submit" className="bg-primary text-white rounded-md py-2 px-6 mt-4 mx-auto text-medium" disableAnimation>Iniciar sesión</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}