import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassBadge } from "@/components/ui/glass-badge";
import { EnhancedCard, QuickActionCard } from "@/components/ui/enhanced-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  Zap, 
  Heart, 
  Star, 
  Search,
  User,
  Settings,
  Bell,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ExternalLink,
  Download,
  Upload,
  Play,
  Pause,
  Mail,
  Phone
} from "lucide-react";

export function DesignSystemShowcase() {
  const [selectedComponent, setSelectedComponent] = useState("buttons");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Glass Morphism Design System</h1>
          <p className="text-slate-300">
            Enterprise-grade UI components with beautiful glass morphism effects
          </p>
        </div>
        
        <GlassBadge variant="primary" glow>
          <Sparkles className="w-4 h-4" />
          Live Demo
        </GlassBadge>
      </div>

      <Tabs value={selectedComponent} onValueChange={setSelectedComponent} className="space-y-6">
        <Card className="backdrop-blur-md bg-white/10 border border-white/20">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-6 bg-white/10">
              <TabsTrigger value="buttons" className="data-[state=active]:bg-white/20">Buttons</TabsTrigger>
              <TabsTrigger value="cards" className="data-[state=active]:bg-white/20">Cards</TabsTrigger>
              <TabsTrigger value="inputs" className="data-[state=active]:bg-white/20">Inputs</TabsTrigger>
              <TabsTrigger value="badges" className="data-[state=active]:bg-white/20">Badges</TabsTrigger>
              <TabsTrigger value="enhanced" className="data-[state=active]:bg-white/20">Enhanced</TabsTrigger>
              <TabsTrigger value="animations" className="data-[state=active]:bg-white/20">Animations</TabsTrigger>
            </TabsList>
          </CardHeader>
        </Card>

        {/* Buttons Section */}
        <TabsContent value="buttons" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <CardHeader>
                <CardTitle className="text-white">Glass Buttons</CardTitle>
                <CardDescription className="text-slate-300">
                  Beautiful glass morphism buttons with various styles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <GlassButton>Default</GlassButton>
                  <GlassButton variant="primary">Primary</GlassButton>
                  <GlassButton variant="secondary">Secondary</GlassButton>
                  <GlassButton variant="accent">Accent</GlassButton>
                  <GlassButton variant="success">Success</GlassButton>
                  <GlassButton variant="warning">Warning</GlassButton>
                  <GlassButton variant="danger">Danger</GlassButton>
                  <GlassButton variant="ghost">Ghost</GlassButton>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardHeader>
                <CardTitle className="text-white">Button Variants</CardTitle>
                <CardDescription className="text-slate-300">
                  Different sizes and states
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <GlassButton size="sm" leftIcon={<Zap className="w-4 h-4" />}>
                    Small Button
                  </GlassButton>
                  <GlassButton leftIcon={<Settings className="w-4 h-4" />} rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Default Button
                  </GlassButton>
                  <GlassButton size="lg" variant="primary" leftIcon={<Star className="w-5 h-5" />}>
                    Large Button
                  </GlassButton>
                  <GlassButton variant="accent" loading>
                    Loading Button
                  </GlassButton>
                  <GlassButton variant="primary" glow>
                    Glowing Button
                  </GlassButton>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </TabsContent>

        {/* Cards Section */}
        <TabsContent value="cards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard variant="default">
              <CardHeader>
                <CardTitle className="text-white">Default Glass Card</CardTitle>
                <CardDescription className="text-slate-300">
                  Standard glass morphism effect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 text-sm">
                  This is a default glass card with subtle transparency and blur effects.
                </p>
              </CardContent>
            </GlassCard>

            <GlassCard variant="strong">
              <CardHeader>
                <CardTitle className="text-white">Strong Glass Card</CardTitle>
                <CardDescription className="text-slate-300">
                  Enhanced glass effect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 text-sm">
                  This card has a stronger glass effect with more pronounced blur.
                </p>
              </CardContent>
            </GlassCard>

            <GlassCard variant="gradient" glow>
              <CardHeader>
                <CardTitle className="text-white">Gradient Glass Card</CardTitle>
                <CardDescription className="text-slate-300">
                  With gradient background and glow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 text-sm">
                  This card features a gradient background and glowing effect.
                </p>
              </CardContent>
            </GlassCard>
          </div>
        </TabsContent>

        {/* Inputs Section */}
        <TabsContent value="inputs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <CardHeader>
                <CardTitle className="text-white">Glass Inputs</CardTitle>
                <CardDescription className="text-slate-300">
                  Transparent input fields with glass effects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <GlassInput placeholder="Default input" />
                <GlassInput 
                  placeholder="Search..." 
                  leftIcon={<Search className="w-4 h-4" />}
                  variant="search"
                />
                <GlassInput 
                  placeholder="Email address" 
                  leftIcon={<Mail className="w-4 h-4" />}
                  type="email"
                />
                <GlassInput 
                  placeholder="Password" 
                  variant="password"
                />
                <GlassInput 
                  placeholder="Error state" 
                  error={true}
                  helperText="This field is required"
                />
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardHeader>
                <CardTitle className="text-white">Comparison</CardTitle>
                <CardDescription className="text-slate-300">
                  Glass vs Standard inputs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Glass Input:</label>
                  <GlassInput placeholder="Glass morphism input" />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Standard Input:</label>
                  <Input placeholder="Standard input" className="bg-white/5 border-white/20 text-white" />
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </TabsContent>

        {/* Badges Section */}
        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <CardHeader>
                <CardTitle className="text-white">Glass Badges</CardTitle>
                <CardDescription className="text-slate-300">
                  Transparent badges with various styles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <GlassBadge>Default</GlassBadge>
                  <GlassBadge variant="primary">Primary</GlassBadge>
                  <GlassBadge variant="success">Success</GlassBadge>
                  <GlassBadge variant="danger">Danger</GlassBadge>
                  <GlassBadge variant="warning">Warning</GlassBadge>
                  <GlassBadge variant="info">Info</GlassBadge>
                  <GlassBadge variant="purple">Purple</GlassBadge>
                  <GlassBadge variant="pink">Pink</GlassBadge>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardHeader>
                <CardTitle className="text-white">Badge Variants</CardTitle>
                <CardDescription className="text-slate-300">
                  With icons, dots, and special effects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <GlassBadge variant="primary" icon={<Star className="w-3 h-3" />}>
                    With Icon
                  </GlassBadge>
                  <GlassBadge variant="success" dot>
                    With Dot
                  </GlassBadge>
                  <GlassBadge variant="warning" dot pulse>
                    Pulsing
                  </GlassBadge>
                  <GlassBadge variant="primary" glow>
                    Glowing
                  </GlassBadge>
                  <GlassBadge size="lg" variant="accent">
                    Large
                  </GlassBadge>
                  <GlassBadge size="xs" variant="info">
                    Tiny
                  </GlassBadge>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </TabsContent>

        {/* Enhanced Components */}
        <TabsContent value="enhanced" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EnhancedCard
              title="Project Alpha"
              subtitle="Marketing Campaign"
              description="A comprehensive social media campaign targeting Gen Z audience with interactive content and influencer partnerships."
              icon={<Sparkles className="w-5 h-5 text-blue-400" />}
              badge={<GlassBadge variant="success">Active</GlassBadge>}
              interactive
              external
            />

            <QuickActionCard
              title="Total Reach"
              stat="2.4M"
              change="+12.5%"
              changeType="positive"
              trend={<TrendingUp className="w-4 h-4 text-green-400" />}
              icon={<Users className="w-5 h-5 text-purple-400" />}
              glow
            />

            <EnhancedCard
              title="Team Meeting"
              subtitle="Daily Standup"
              description="Discuss project progress and plan for the day ahead."
              icon={<Bell className="w-5 h-5 text-orange-400" />}
              actions={
                <GlassButton size="sm" variant="primary">
                  Join Call
                </GlassButton>
              }
              footer={
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">9:00 AM</span>
                  <GlassBadge variant="warning" size="sm">In 5 min</GlassBadge>
                </div>
              }
            />
          </div>
        </TabsContent>

        {/* Animations Section */}
        <TabsContent value="animations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <CardHeader>
                <CardTitle className="text-white">Hover Animations</CardTitle>
                <CardDescription className="text-slate-300">
                  Interactive components with smooth transitions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <GlassButton className="hover-lift">Lift on Hover</GlassButton>
                <GlassButton className="hover-scale">Scale on Hover</GlassButton>
                <GlassButton className="hover-glow">Glow on Hover</GlassButton>
                <div className="p-4 bg-white/5 rounded-lg hover-glass cursor-pointer">
                  <p className="text-white text-sm">Hover for glass effect</p>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardHeader>
                <CardTitle className="text-white">Loading States</CardTitle>
                <CardDescription className="text-slate-300">
                  Elegant loading animations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded loading-shimmer"></div>
                  <div className="h-4 bg-white/10 rounded loading-shimmer w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded loading-shimmer w-1/2"></div>
                </div>
                
                <GlassButton loading disabled>
                  Processing...
                </GlassButton>
                
                <div className="animate-pulse">
                  <GlassBadge variant="primary">Pulsing Badge</GlassBadge>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="mt-12 text-center">
        <GlassCard>
          <CardContent className="p-6">
            <h3 className="text-white font-medium mb-2">🎉 Phase 7 Complete!</h3>
            <p className="text-slate-300 text-sm mb-4">
              Glass morphism design system successfully implemented across all components
            </p>
            <div className="flex items-center justify-center gap-4">
              <GlassBadge variant="success" glow>
                <CheckCircle className="w-3 h-3" />
                Design System Ready
              </GlassBadge>
              <GlassBadge variant="primary">
                7/7 Phases Complete
              </GlassBadge>
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}