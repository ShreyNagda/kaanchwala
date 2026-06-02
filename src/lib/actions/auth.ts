"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";

export async function signIn(prevState: unknown, formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = loginSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(validated.data);

  if (error) {
    return { error: { email: [error.message] } };
  }

  if (data?.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role === "admin") {
      redirect("/admin");
    }
  }

  const redirectTo = formData.get("redirect") as string;
  redirect(redirectTo || "/");
}

export async function signUp(prevState: unknown, formData: FormData) {
  const raw = {
    full_name: formData.get("full_name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validated = registerSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      data: {
        full_name: validated.data.full_name,
        phone: validated.data.phone,
      },
    },
  });

  if (error) {
    console.log(error);
    return { error: { email: [error.message] } };
  }

  // Update profile with phone
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from("profiles")
      .update({
        phone: validated.data.phone,
        full_name: validated.data.full_name,
      })
      .eq("id", user.id);
  }

  const redirectTo = formData.get("redirect") as string;
  redirect(`/register/success?redirect=${encodeURIComponent(redirectTo || "/")}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function convertGuestToAccount(
  prevState: unknown,
  formData: FormData,
) {
  const raw = {
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    password: formData.get("password") as string,
    full_name: formData.get("full_name") as string,
  };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: raw.email,
    password: raw.password,
    options: {
      data: {
        full_name: raw.full_name,
        phone: raw.phone,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Link past orders to this new account
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from("orders")
      .update({ user_id: user.id })
      .eq("customer_email", raw.email)
      .is("user_id", null);

    await supabase
      .from("profiles")
      .update({
        phone: raw.phone,
        full_name: raw.full_name,
      })
      .eq("id", user.id);
  }

  return {
    success: true,
    message: "Account created! You get 5% off your next order.",
  };
}
