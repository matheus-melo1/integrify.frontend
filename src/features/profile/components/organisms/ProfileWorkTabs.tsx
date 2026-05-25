import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { SurfaceCard } from "@/shared/components/molecules/SurfaceCard/SurfaceCard";
import { EmptyState } from "@/shared/components/molecules/EmptyState/EmptyState";
import { ProfileWorkCard } from "../molecules/ProfileWorkCard";
import type { Profile } from "../../types/profile.types";

type TabValue = "work" | "moodboards" | "likes" | "about";

type Props = {
  profile: Profile;
};

export function ProfileWorkTabs({ profile }: Props) {
  const [tab, setTab] = useState<TabValue>("work");

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
      <TabsList variant="line" className="border-b border-neutral-800 w-full justify-start rounded-none px-0">
        <TabsTrigger value="work" className="gap-1">
          Work
          <sup className="text-[10px] text-muted-foreground">
            {profile.works.length}
          </sup>
        </TabsTrigger>
        <TabsTrigger value="moodboards">Moodboards</TabsTrigger>
        <TabsTrigger value="likes">Curtidas</TabsTrigger>
        <TabsTrigger value="about">Sobre</TabsTrigger>
      </TabsList>

      <TabsContent value="work" className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.works.map((w) => (
            <ProfileWorkCard key={w.id} work={w} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="moodboards" className="pt-4">
        <EmptyState
          title="Sem moodboards ainda"
          description="Em breve você poderá organizar suas referências aqui."
        />
      </TabsContent>

      <TabsContent value="likes" className="pt-4">
        <EmptyState
          title="Sem curtidas"
          description="Os produtos que você curtir vão aparecer aqui."
        />
      </TabsContent>

      <TabsContent value="about" className="pt-4">
        <SurfaceCard innerClassName="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Sobre
            </span>
            <p className="text-sm leading-relaxed">{profile.bio}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-neutral-700/60">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                E-mail
              </span>
              <span className="text-sm">{profile.email}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Função
              </span>
              <span className="text-sm capitalize">{profile.role}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Localização
              </span>
              <span className="text-sm">{profile.location}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Telefone
              </span>
              <span className="text-sm">{profile.phone}</span>
            </div>
          </div>
        </SurfaceCard>
      </TabsContent>
    </Tabs>
  );
}
