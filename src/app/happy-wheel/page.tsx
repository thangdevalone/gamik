"use client";
import WheelComponent from "@/components/common/wheel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, useEffect, useState } from "react";
function HappyWheel() {
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<String[]>([]);
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };
  useEffect(() => {
    const line_s = value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    setLines(line_s as string[]);
  }, [value]);
  return (
      <div className="flex sm:px-3 relative mt-[88px] flex-row items-center w-full md:flex-col h-[calc(100vh-88px)] md:h-[calc(100vh-4rem)] py-5 md:pt-3 md:pb-2 overflow-x-hidden ">
        <WheelComponent setValue={setValue} wheelItem={lines} />
        <div className="h-full absoulte mr-5">
          <Tabs defaultValue="1" className="w-[400px] sm:w-full">
            <TabsList>
              <TabsTrigger value="1">Cấu hình</TabsTrigger>
              <TabsTrigger value="2">Lịch sử</TabsTrigger>
              <TabsTrigger value="3">Tỉ lệ</TabsTrigger>
            </TabsList>
            <TabsContent value="1">
              <Card>
                <CardHeader>
                  <CardTitle>Cấu hình</CardTitle>
                  <CardDescription>
                    Tinh chỉnh vòng quay và thêm mới nhãn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="lablewheel">Nhãn mới</Label>
                    <Textarea
                      rows={8}
                      value={value}
                      spellCheck={false}
                      onChange={handleChange}
                      id="lablewheel"
                      placeholder="Viết nhãn mới ở mỗi dòng"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="2">Change your password here.</TabsContent>
          </Tabs>
        </div>
      </div>
 
  );
}
export default HappyWheel;