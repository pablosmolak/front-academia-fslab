"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState, forwardRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const InputPassword = forwardRef(({ field, className, ...props }, ref) => {
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const handleChange = (e) => {
        field.onChange(e.target.value);
        if (typeof props.onChange === "function") {
            props.onChange(e);
        }
    };

    return (
        <div>
            <div className="relative">
                <Input
                    type={mostrarSenha ? "text" : "password"}
                    onChange={handleChange}
                    value={field.value}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={ref || field.ref}
                    className={cn("pe-10", className)}
                    {...props}
                />
                <Button
                    tabIndex={-1}
                    variant="ghost"
                    type="button"
                    className="absolute right-0 inset-y-0 p-2"
                    data-test="toggle-password"
                    onClick={() => setMostrarSenha((prev) => !prev)}
                >
                    {mostrarSenha ? (
                        <EyeOff className="text-gray-500 w-5" data-test="ocultarSenha" />
                    ) : (
                        <Eye className="text-gray-500 w-5" data-test="visualizarSenha" />
                    )}
                </Button>
            </div>
        </div>
    );
});

InputPassword.displayName = "InputPassword";

export default InputPassword;
