import React from 'react';
import { Button, Card, Input, Badge } from '../designSystem';
import type { ButtonProps, BadgeProps } from '../designSystem';
import './DesignSystemDocs.css';
import {
  MdPalette,
  MdCircle,
  MdLabel,
  MdInventory,
  MdEdit,
  MdContentCopy,
  MdCheck
} from 'react-icons/md';

interface ComponentExample {
  name: string;
  description: string;
  variants: Array<{
    label: string;
    props: any;
    code: string;
  }>;
}

const DesignSystemDocs: React.FC = () => {
  const buttonExamples: ComponentExample = {
    name: 'Button',
    description: 'Primary interactive component for user actions',
    variants: [
      {
        label: 'Primary',
        props: { variant: 'primary' as ButtonProps['variant'], children: 'Primary Button' },
        code: '<Button variant="primary">Primary Button</Button>'
      },
      {
        label: 'Secondary',
        props: { variant: 'secondary' as ButtonProps['variant'], children: 'Secondary Button' },
        code: '<Button variant="secondary">Secondary Button</Button>'
      },
      {
        label: 'Success',
        props: { variant: 'success' as ButtonProps['variant'], children: 'Success Button' },
        code: '<Button variant="success">Success Button</Button>'
      },
      {
        label: 'Danger',
        props: { variant: 'danger' as ButtonProps['variant'], children: 'Danger Button' },
        code: '<Button variant="danger">Danger Button</Button>'
      },
      {
        label: 'Outline',
        props: { variant: 'outline' as ButtonProps['variant'], children: 'Outline Button' },
        code: '<Button variant="outline">Outline Button</Button>'
      },
      {
        label: 'Disabled',
        props: { variant: 'primary' as ButtonProps['variant'], disabled: true, children: 'Disabled Button' },
        code: '<Button variant="primary" disabled>Disabled Button</Button>'
      },
      {
        label: 'Full Width',
        props: { variant: 'primary' as ButtonProps['variant'], fullWidth: true, children: 'Full Width Button' },
        code: '<Button variant="primary" fullWidth>Full Width Button</Button>'
      }
    ]
  };

  const badgeExamples: ComponentExample = {
    name: 'Badge',
    description: 'Small status indicators and labels',
    variants: [
      {
        label: 'Default',
        props: { variant: 'default' as BadgeProps['variant'], children: 'Default' },
        code: '<Badge variant="default">Default</Badge>'
      },
      {
        label: 'Primary',
        props: { variant: 'primary' as BadgeProps['variant'], children: 'Primary' },
        code: '<Badge variant="primary">Primary</Badge>'
      },
      {
        label: 'Secondary',
        props: { variant: 'secondary' as BadgeProps['variant'], children: 'Secondary' },
        code: '<Badge variant="secondary">Secondary</Badge>'
      },
      {
        label: 'Success',
        props: { variant: 'success' as BadgeProps['variant'], children: 'Success' },
        code: '<Badge variant="success">Success</Badge>'
      },
      {
        label: 'Danger',
        props: { variant: 'danger' as BadgeProps['variant'], children: 'Danger' },
        code: '<Badge variant="danger">Danger</Badge>'
      },
      {
        label: 'Warning',
        props: { variant: 'warning' as BadgeProps['variant'], children: 'Warning' },
        code: '<Badge variant="warning">Warning</Badge>'
      }
    ]
  };

  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="design-system-docs">
      <Card title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MdPalette size={20} /> Design System Documentation</span>}>
        <p className="docs-intro">
          Complete component library with TypeScript support. All components are built with accessibility,
          consistency, and reusability in mind.
        </p>

        {/* Button Documentation */}
        <section className="component-section">
          <h3 className="component-title">
            <span className="component-icon"><MdCircle size={20} /></span>
            {buttonExamples.name}
          </h3>
          <p className="component-description">{buttonExamples.description}</p>

          <div className="variants-grid">
            {buttonExamples.variants.map((variant, index) => (
              <div key={index} className="variant-card">
                <div className="variant-label">{variant.label}</div>
                <div className="variant-preview">
                  <Button {...variant.props} />
                </div>
                <div className="variant-code">
                  <code>{variant.code}</code>
                  <button
                    className="copy-button"
                    onClick={() => handleCopyCode(variant.code)}
                    title="Copy code"
                  >
                    {copiedCode === variant.code ? <MdCheck size={14} /> : <MdContentCopy size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="props-table">
            <h4>Props</h4>
            <table>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>variant</code></td>
                  <td><code>'primary' | 'secondary' | 'success' | 'danger' | 'outline'</code></td>
                  <td><code>'primary'</code></td>
                  <td>Visual style variant</td>
                </tr>
                <tr>
                  <td><code>size</code></td>
                  <td><code>'small' | 'medium' | 'large'</code></td>
                  <td><code>'medium'</code></td>
                  <td>Button size</td>
                </tr>
                <tr>
                  <td><code>disabled</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Disable button interactions</td>
                </tr>
                <tr>
                  <td><code>fullWidth</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Expand button to full width</td>
                </tr>
                <tr>
                  <td><code>onClick</code></td>
                  <td><code>() =&gt; void</code></td>
                  <td><code>undefined</code></td>
                  <td>Click event handler</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Badge Documentation */}
        <section className="component-section">
          <h3 className="component-title">
            <span className="component-icon"><MdLabel size={20} /></span>
            {badgeExamples.name}
          </h3>
          <p className="component-description">{badgeExamples.description}</p>

          <div className="variants-grid">
            {badgeExamples.variants.map((variant, index) => (
              <div key={index} className="variant-card">
                <div className="variant-label">{variant.label}</div>
                <div className="variant-preview">
                  <Badge {...variant.props} />
                </div>
                <div className="variant-code">
                  <code>{variant.code}</code>
                  <button
                    className="copy-button"
                    onClick={() => handleCopyCode(variant.code)}
                    title="Copy code"
                  >
                    {copiedCode === variant.code ? <MdCheck size={14} /> : <MdContentCopy size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="props-table">
            <h4>Props</h4>
            <table>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>variant</code></td>
                  <td><code>'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning'</code></td>
                  <td><code>'default'</code></td>
                  <td>Visual style variant</td>
                </tr>
                <tr>
                  <td><code>children</code></td>
                  <td><code>React.ReactNode</code></td>
                  <td><code>required</code></td>
                  <td>Badge content</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Card & Input Examples */}
        <section className="component-section">
          <h3 className="component-title">
            <span className="component-icon"><MdInventory size={20} /></span>
            Card
          </h3>
          <p className="component-description">Container component for grouping content</p>

          <div className="variants-grid">
            <div className="variant-card">
              <div className="variant-label">Basic Card</div>
              <div className="variant-preview">
                <Card>
                  <p>This is a basic card with content</p>
                </Card>
              </div>
              <div className="variant-code">
                <code>&lt;Card&gt;Content&lt;/Card&gt;</code>
              </div>
            </div>
            <div className="variant-card">
              <div className="variant-label">With Title</div>
              <div className="variant-preview">
                <Card title="Card Title">
                  <p>Card with a title header</p>
                </Card>
              </div>
              <div className="variant-code">
                <code>&lt;Card title="Card Title"&gt;...&lt;/Card&gt;</code>
              </div>
            </div>
            <div className="variant-card">
              <div className="variant-label">Hoverable</div>
              <div className="variant-preview">
                <Card hoverable>
                  <p>Hover over me!</p>
                </Card>
              </div>
              <div className="variant-code">
                <code>&lt;Card hoverable&gt;...&lt;/Card&gt;</code>
              </div>
            </div>
          </div>
        </section>

        <section className="component-section">
          <h3 className="component-title">
            <span className="component-icon"><MdEdit size={20} /></span>
            Input
          </h3>
          <p className="component-description">Form input component with validation support</p>

          <div className="variants-grid">
            <div className="variant-card">
              <div className="variant-label">Text Input</div>
              <div className="variant-preview">
                <Input label="Username" placeholder="Enter username" />
              </div>
              <div className="variant-code">
                <code>&lt;Input label="Username" /&gt;</code>
              </div>
            </div>
            <div className="variant-card">
              <div className="variant-label">With Error</div>
              <div className="variant-preview">
                <Input label="Email" error="Invalid email" />
              </div>
              <div className="variant-code">
                <code>&lt;Input error="Invalid email" /&gt;</code>
              </div>
            </div>
            <div className="variant-card">
              <div className="variant-label">Password</div>
              <div className="variant-preview">
                <Input label="Password" type="password" />
              </div>
              <div className="variant-code">
                <code>&lt;Input type="password" /&gt;</code>
              </div>
            </div>
          </div>
        </section>

        <div className="docs-footer">
          <Badge variant="success">TypeScript Ready</Badge>
          <Badge variant="primary">Fully Typed</Badge>
          <Badge variant="secondary">Accessible</Badge>
        </div>
      </Card>
    </div>
  );
};

export default DesignSystemDocs;
