import { AppShell } from "@/components/layout/app-shell";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

export default function Home() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title="Dashboard"
          description="Monitor your logistics operations from one place."
          actions={
            <>
              <Button variant="outline">
                View Shipments
              </Button>

              <Button>
                Create Shipment
              </Button>
            </>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>
              LogiTrack Application Shell
            </CardTitle>

            <CardDescription>
              The application foundation is ready for
              feature development.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="success">
                System Ready
              </Badge>

              <Badge variant="info">
                Phase 1
              </Badge>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </AppShell>
  );
}