import "server-only";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const lang: I18nLocale = cookieStore.get("lang")?.value as I18nLocale;
  const i18n = getDictionary(lang);
  return (
    <div className="m-auto card w-[400px] h-[400px] flex flex-col">
      <Tabs defaultValue="create" className="grow">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="create">
            {i18n.createRoomForm.create}
          </TabsTrigger>
          <TabsTrigger className="w-full" value="join">
            {i18n.joinRoomForm.join}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
      
        </TabsContent>

        <TabsContent value="join">something</TabsContent>
      </Tabs>
    </div>
  );
}
