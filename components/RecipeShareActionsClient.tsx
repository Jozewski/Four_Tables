"use client";

import dynamic from "next/dynamic";

const RecipeShareActions = dynamic(() => import("@/components/RecipeShareActions"), {
  ssr: false,
});

type Props = {
  title: string;
  description?: string | null;
  url: string;
  imageUrl?: string | null;
};

export default function RecipeShareActionsClient(props: Props) {
  return <RecipeShareActions {...props} />;
}
