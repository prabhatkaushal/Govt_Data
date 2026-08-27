import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f7f6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
            Department of Security
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure Government Access Portal
          </p>
        </div>

        <Card className="border-t-4 border-t-blue-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Authentication Required</CardTitle>
            <CardDescription>
              Please enter your authorized credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id-number">Identification Number</Label>
              <Input id="id-number" placeholder="Enter ID number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passcode</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white">
              Authenticate
            </Button>
            <div className="text-xs text-center text-gray-500">
              Unauthorized access is strictly prohibited and subject to prosecution.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
