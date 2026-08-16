// "use client";

// import { Suspense, useState, type FormEvent } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAuth } from "@/lib/auth-context";
// import { ApiError } from "@/lib/api";

// function VerifyOtpForm() {
//   const router = useRouter();
//   const params = useSearchParams();
//   const userId = params.get("userId") ?? "";
//   const { completeLogin } = useAuth();

//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   async function onSubmit(e: FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setSubmitting(true);
//     try {
//       const user = await completeLogin(userId, otp);
//       if (user.role === "admin" || user.role === "employee") {
//         router.push(`/${user.role}`);
//       } else {
//         setError("This console is for employee and admin accounts only.");
//       }
//     } catch (err) {
//       setError(err instanceof ApiError ? err.message : "That code didn't work. Try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <main className="flex min-h-screen items-center justify-center px-4">
//       <div className="w-full max-w-sm">
//         <div className="mb-8 text-center">
//           <p className="text-xs uppercase tracking-[0.2em] text-brass">GCMS</p>
//           <h1 className="mt-2 text-2xl font-semibold text-ink">Enter your code</h1>
//           <p className="mt-1 text-sm text-muted">
//             We sent a one-time code to your email or phone.
//           </p>
//         </div>

//         <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-line bg-surface p-6 shadow-sm">
//           <div>
//             <label htmlFor="otp" className="mb-1 block text-sm font-medium text-ink">
//               Verification code
//             </label>
//             <input
//               id="otp"
//               type="text"
//               inputMode="numeric"
//               required
//               autoFocus
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full rounded-md border border-line bg-white px-3 py-2 text-center text-lg tracking-[0.3em] text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
//             />
//           </div>

//           {error && (
//             <p className="rounded-md bg-brick/10 px-3 py-2 text-sm text-brick" role="alert">
//               {error}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={submitting || !userId}
//             className="w-full rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-ink-2 disabled:opacity-50"
//           >
//             {submitting ? "Verifying…" : "Verify and sign in"}
//           </button>

//           <button
//             type="button"
//             onClick={() => router.push("/login")}
//             className="w-full text-center text-sm text-muted hover:text-ink"
//           >
//             Use a different account
//           </button>
//         </form>
//       </div>
//     </main>
//   );
// }

// export default function VerifyOtpPage() {
//   return (
//     <Suspense fallback={null}>
//       <VerifyOtpForm />
//     </Suspense>
//   );
// }

"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/locale-context";
import { ApiError } from "@/lib/api";

function VerifyOtpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get("userId") ?? "";
  const { completeLogin } = useAuth();
  const { t } = useLocale();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await completeLogin(userId, otp);
      if (user.role === "admin" || user.role === "employee") {
        router.push(`/${user.role}`);
      } else {
        setError(t("verifyOtp.wrongRole"));
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "That code didn't work. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-brass">GCMS</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">
            {t("verifyOtp.title")}
          </h1>
          <p className="mt-1 text-sm text-muted">{t("verifyOtp.subtitle")}</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-lg border border-line bg-surface p-6 shadow-sm"
        >
          <div>
            <label
              htmlFor="otp"
              className="mb-1 block text-sm font-medium text-ink"
            >
              {t("verifyOtp.codeLabel")}
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              required
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-center text-lg tracking-[0.3em] text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
            />
          </div>

          {error && (
            <p
              className="rounded-md bg-brick/10 px-3 py-2 text-sm text-brick"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !userId}
            className="w-full rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-ink-2 disabled:opacity-50"
          >
            {submitting ? t("verifyOtp.verifying") : t("verifyOtp.verify")}
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full text-center text-sm text-muted hover:text-ink"
          >
            {t("verifyOtp.useAnother")}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
