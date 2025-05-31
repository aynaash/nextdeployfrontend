"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";

import { User } from "../../lib/types";
interface UserNameFormProps {
  user: Pick<User, "id" | "name">;
}

export function UserNameForm({ user }: UserNameFormProps) {
  return (
    <form>
      <SectionColumns
        title="Your Name"
        description="Please enter a display name you are comfortable with."
      >
        <div className="flex w-full items-center gap-2">
          <Label className="sr-only" htmlFor="name">
            Name
          </Label>
          <Input
            id="name"
            className="flex-1 cursor-not-allowed opacity-70"
            size={32}
            value={user?.name || ""}
            disabled
          />
          <Button
            type="button"
            variant="outline"
            disabled
            className="w-[67px] shrink-0 cursor-not-allowed px-0 opacity-70 sm:w-[130px]"
          >
            Coming Soon
          </Button>
        </div>
        <div className="flex flex-col justify-between p-1">
          <p className="text-[13px] text-muted-foreground">
            Max 32 characters
          </p>
        </div>
      </SectionColumns>
    </form>
  );
}

/*
// Dynamic profile update logic – disabled for now

import { useState, useTransition } from "react";
import { updateUserName, type FormData } from "@/actions/update-user-name";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "../../auth-client.ts";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { userNameSchema } from "@/lib/validations/user";
import { Icons } from "@/components/shared/icons";

const { update } = useSession();
const [updated, setUpdated] = useState(false);
const [isPending, startTransition] = useTransition();
const updateUserNameWithId = updateUserName.bind(null, user.id);

const checkUpdate = (value) => {
  setUpdated(user.name !== value);
};

const {
  handleSubmit,
  register,
  formState: { errors },
} = useForm<FormData>({
  resolver: zodResolver(userNameSchema),
  defaultValues: {
    name: user?.name || "",
  },
});

const onSubmit = handleSubmit((data) => {
  startTransition(async () => {
    const { status } = await updateUserNameWithId(data);

    if (status !== "success") {
      toast.error("Something went wrong.", {
        description: "Your name was not updated. Please try again.",
      });
    } else {
      await update();
      setUpdated(false);
      toast.success("Your name has been updated.");
    }
  });
});
*/
