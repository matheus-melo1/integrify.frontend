import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { SurfaceCard } from "@/shared/components/molecules/SurfaceCard/SurfaceCard";
import { AvatarStack } from "@/shared/components/molecules/AvatarStack/AvatarStack";
import { MarketplaceLogo } from "@/shared/components/molecules/MarketplaceLogo";
import { StatusBadge } from "@/shared/components/molecules/StatusBadge/StatusBadge";
import { usePopularAds } from "../../hooks/usePopularAds";

export function PopularAdsTable() {
  const { ads } = usePopularAds();

  return (
    <SurfaceCard innerClassName="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Anúncios em Destaque</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-md bg-neutral-800">⌘ 2</span>
          <span>como Lista</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground">Rank</TableHead>
              <TableHead className="text-xs text-muted-foreground">Produto</TableHead>
              <TableHead className="text-xs text-muted-foreground">Vendedor</TableHead>
              <TableHead className="text-xs text-muted-foreground">Adicionado</TableHead>
              <TableHead className="text-xs text-muted-foreground">Marketplace</TableHead>
              <TableHead className="text-xs text-muted-foreground">Seguidores</TableHead>
              <TableHead className="text-xs text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs text-muted-foreground text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.map((ad) => (
              <TableRow
                key={ad.id}
                className="border-neutral-800 hover:bg-neutral-800/40"
              >
                <TableCell className="text-muted-foreground">#{ad.rank}</TableCell>
                <TableCell className="font-medium">{ad.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] uppercase">
                      {ad.seller.name[0]}
                    </div>
                    <span className="text-xs">{ad.seller.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {ad.addedAt}
                </TableCell>
                <TableCell>
                  <MarketplaceLogo marketplace={ad.marketplace} />
                </TableCell>
                <TableCell>
                  <AvatarStack members={ad.followers} max={3} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={ad.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant={ad.status === "pending" ? "outline" : "default"}
                    className="h-7 text-xs"
                  >
                    {ad.status === "pending" ? "Solicitar" : "Ver"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SurfaceCard>
  );
}
