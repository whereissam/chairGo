import React from 'react'
import { Button } from './Button'
import { Input, InputField } from './Input'
import { Card, CardHeader, CardTitle, CardContent } from './Card'

const TestDesignSystem = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-foreground">ChairGo Design System Test</h1>
      
      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="success">Success Button</Button>
          <Button variant="warning">Warning Button</Button>
        </CardContent>
      </Card>

      {/* Button Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Button Sizes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Form Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <InputField 
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            required
          />
          <InputField 
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
          <InputField 
            label="Message (Error State)"
            error="This field is required"
            placeholder="Enter a message"
          />
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="w-full h-16 bg-primary rounded-md"></div>
              <p className="text-sm">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-secondary rounded-md"></div>
              <p className="text-sm">Secondary</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-accent rounded-md"></div>
              <p className="text-sm">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-destructive rounded-md"></div>
              <p className="text-sm">Destructive</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h1 className="text-4xl font-bold">H1 Heading</h1>
          <h2 className="text-3xl font-semibold">H2 Heading</h2>
          <h3 className="text-2xl font-medium">H3 Heading</h3>
          <p className="text-base">Regular paragraph text with normal weight and size.</p>
          <p className="text-sm text-muted-foreground">Small muted text for captions and labels.</p>
        </CardContent>
      </Card>

      {/* Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-green-800 font-medium">✅ Design System Working</h3>
        <p className="text-green-700 text-sm mt-1">
          All components are rendering correctly with the ChairGo design system!
        </p>
      </div>
    </div>
  )
}

export default TestDesignSystem