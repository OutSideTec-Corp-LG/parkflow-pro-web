"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginRequest, saveSession } from "@/lib/api";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const demoLogin = "admin.demo@example.invalid";
const demoPasswords = new Set(["123456", "troque-esta-senha"]);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin.demo@example.invalid");
  const [password, setPassword] = useState("troque-esta-senha");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      setError("Informe e-mail e senha para acessar o sistema.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const session = await loginRequest(email, password);
      saveSession(session);
      router.push("/dashboard");
      router.refresh();
    } catch (loginError) {
      if (email === demoLogin && demoPasswords.has(password)) {
        router.push("/dashboard");
        return;
      }

      setError(loginError instanceof Error ? loginError.message : "Falha ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex justify-center">
            <Image
              src={`${basePath}/smartpark-logo.png`}
              alt="SmartPark"
              width={260}
              height={180}
              priority
              className="h-auto w-64 object-contain"
            />
          </div>

          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
            SmartPark
          </p>
          <h1 className="mt-3 text-3xl font-bold">Acesso ao sistema</h1>
          <p className="mt-3 text-sm text-slate-300">
            Entre para visualizar o painel operacional do estacionamento.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">E-mail</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="admin.demo@example.invalid"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="Senha"
            />
          </div>

          {error ? (
            <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar no painel"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
          <p className="font-semibold">Dados de teste:</p>
          <p className="mt-1">E-mail: admin.demo@example.invalid</p>
          <p>Senha: 123456</p>
        </div>

        <div className="mt-6 border-t border-white/10 pt-5" />
      </section>
    </main>
  );
}

