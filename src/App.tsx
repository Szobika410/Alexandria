
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignIn, SignUp, SignedIn, SignedOut, ClerkLoading } from "@clerk/clerk-react";
import Index from "./pages/Index";
import BookDetails from "./pages/BookDetails";
import GroupDetail from "./pages/GroupDetail";
import CreateGroup from "./pages/CreateGroup";
import MakeOffer from "./pages/MakeOffer";
import Trade from "./pages/Trade";
import TradeChat from "./pages/TradeChat";
import Purchase from "./pages/Purchase";
import Publish from "./pages/Publish";
import Wishlist from "./pages/Wishlist";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SellerProfile from "./pages/SellerProfile";
import NotFound from "./pages/NotFound";
import { ClerkProvider } from "@clerk/clerk-react";

const queryClient = new QueryClient();

const App = () => (
  <ClerkProvider
    publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
    appearance={{
      elements: {
        formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
        card: 'bg-white rounded-lg shadow-xl',
        header: 'bg-white border-b border-gray-200',
        headerTitle: 'text-gray-900 font-bold',
        profileButton: 'bg-blue-600 hover:bg-blue-700 text-white'
      },
    }}
  >
    <BrowserRouter>
      <div className="min-h-screen">
        <ClerkLoading>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Betöltés...</h1>
            </div>
          </div>
        </ClerkLoading>
        <Routes>
          <Route path="/sign-in" element={
            <div className="min-h-screen">
              <SignedOut>
                <div className="flex items-center justify-center h-full">
                  <SignIn 
                    path="/sign-in"
                    routing="path"
                    signUpUrl="/sign-up"
                    afterSignInUrl="/"
                  />
                </div>
              </SignedOut>
            </div>
          } />
          <Route path="/sign-up" element={
            <div className="min-h-screen">
              <SignedOut>
                <div className="flex items-center justify-center h-full">
                  <SignUp 
                    afterSignUpUrl="/sign-in"
                  />
                </div>
              </SignedOut>
            </div>
          } />
          <Route path="/profile" element={
            <div className="min-h-screen">
              <SignedIn>
                <Profile />
              </SignedIn>
            </div>
          } />
          <Route path="/" element={
            <div className="min-h-screen">
              <SignedIn>
                <QueryClientProvider client={queryClient}>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <Index />
                  </TooltipProvider>
                </QueryClientProvider>
              </SignedIn>
            </div>
          } />
          <Route path="/book/:id" element={
            <SignedIn>
              <BookDetails />
            </SignedIn>
          } />
          <Route path="/group/:id" element={
            <SignedIn>
              <GroupDetail />
            </SignedIn>
          } />
          <Route path="/create-group" element={
            <SignedIn>
              <CreateGroup />
            </SignedIn>
          } />
          <Route path="/make-offer" element={
            <SignedIn>
              <MakeOffer />
            </SignedIn>
          } />
          <Route path="/trade" element={
            <SignedIn>
              <Trade />
            </SignedIn>
          } />
          <Route path="/trade-chat" element={
            <SignedIn>
              <TradeChat />
            </SignedIn>
          } />
          <Route path="/purchase" element={
            <SignedIn>
              <Purchase />
            </SignedIn>
          } />
          <Route path="/wishlist" element={
            <SignedIn>
              <Wishlist />
            </SignedIn>
          } />
          <Route path="/messages" element={
            <SignedIn>
              <Messages />
            </SignedIn>
          } />
          <Route path="/profile" element={
            <SignedIn>
              <Profile />
            </SignedIn>
          } />
          <Route path="/settings" element={
            <SignedIn>
              <Settings />
            </SignedIn>
          } />
          <Route path="/seller/:sellerId" element={
            <SignedIn>
              <SellerProfile />
            </SignedIn>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  </ClerkProvider>
);

export default App;
