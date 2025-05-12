import "server-only";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import CreateRoomForm from "@/components/widgets/CreateRoomForm";
import JoinRoomForm from "@/components/widgets/JoinRoomForm";
import { getDictionary, i18nConfig } from "@/i18n/get-dictionary";

export default function Home() {
  const i18n = getDictionary(i18nConfig.defaultLocale);
  return (
    <div className="h-full w-full">
      <div className="m-auto card w-[400px]">
        <Tabs defaultValue="create">
          <TabsList>
            <TabsTrigger value="create">
              {i18n.createRoomForm.create}
            </TabsTrigger>
            <TabsTrigger value="join">{i18n.joinRoomForm.join}</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <CreateRoomForm locale={i18nConfig.defaultLocale} />
          </TabsContent>
          <TabsContent value="join">
            <JoinRoomForm locale={i18nConfig.defaultLocale} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
