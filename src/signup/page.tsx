import React from "react";
import { Zap } from "lucide-react";
import { SignUpForm } from "./signup-form/signupForm";
import { AuroraText } from "@/components/magicui/aurora-text";
import { BackgroundBeamsWithCollision } from "@/components/magicui/beams";
import { WordRotate } from "@/components/magicui/word-rotate";
const SignUp: React.FC = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-muted">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="size-4" />
            </div>
            templater.io
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm />
          </div>
        </div>
      </div>
      <BackgroundBeamsWithCollision className="flex! items-center justify-center h-full! bg-muted lg:block bg-zinc-900">
        <h1 className="flex text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl text-white mx-4 w-full justify-between gap-4 lg:mx-[6rem] xl:mx-[24rem]">
          <WordRotate words={["Send", "Create", "Test", "Sync"]} />
          <AuroraText className="pt-2">
            beautiful <br></br>
            pixel
            <br></br> perfect&nbsp;<br></br> emails&nbsp;
          </AuroraText>
        </h1>
      </BackgroundBeamsWithCollision>
    </div>
  );
};

export default SignUp;
