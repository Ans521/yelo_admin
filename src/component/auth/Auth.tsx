// Commented out for dev phase
// import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        // Commented out for dev phase - auth bypassed
        // try {
        // e.preventDefault();

        // const payload = {
        //     email,
        //     password,
        //     role: "admin"
        // };

        // const res: any = await axios.post("http://localhost:4000/api/auth", payload);

        // localStorage.setItem("token", res.data.token);

        // if (res.status === 200) {
        //     alert("Login successful");
        //     navigate("/");
        // }
        // } catch (error) {
        //     console.error("Login error:", error);
        //     alert("An error occurred during login. Please try again.");
        // }
        e.preventDefault();
        navigate("/");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-2xl shadow-lg w-full max-w-lg min-h-[350px] flex flex-col justify-center"
            >
                <h2 className="text-white text-2xl font-bold text-center mb-6">
                    Business Admin Login
                </h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-lg mb-4 focus:outline-none"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-lg mb-6 focus:outline-none"
                />
                <button
                    type="submit"
                    className="w-full bg-white text-blue-700 font-semibold py-2 rounded-lg hover:bg-gray-200"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
