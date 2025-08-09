import React, { useState, useEffect } from 'react';
import {
  Button, Input, Card, Modal, Navbar, Tooltip, Badge, Spinner, Switch, Alert, GlassButton,
} from '../src';
import { GlassModal } from '../src/components/GlassModal/GlassModal';

export interface ShowcaseItem {
  id: string;
  title: string;
  description?: string;
  code: string;
  render: () => React.ReactNode;
}

function ButtonPreview() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
    </div>
  );
}

function InputPreview() {
  const [value, setValue] = useState('');
  return <Input placeholder="Type here" value={value} onChange={(e) => setValue(e.target.value)} />;
}

function CardPreview() {
  return <Card title="Card Title">This is a basic card.</Card>;
}

function ModalPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h3 style={{ marginTop: 0 }}>Hello</h3>
        <p>This is a modal.</p>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Modal>
    </div>
  );
}

function NavbarPreview() {
  return (
    <Navbar brand="Brand">
      <a href="#">Home</a>
      <a href="#">Docs</a>
    </Navbar>
  );
}

function TooltipPreview() {
  return (
    <Tooltip text="Helpful info">
      <Button>Hover me</Button>
    </Tooltip>
  );
}

function BadgePreview() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge>Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  );
}

function SpinnerPreview() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Spinner />
      <Spinner size={36} />
    </div>
  );
}

function SwitchPreview() {
  const [on, setOn] = useState(false);
  return <Switch checked={on} onChange={setOn} />;
}

function AlertPreview() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <Alert>Info alert</Alert>
      <Alert variant="success">Success alert</Alert>
      <Alert variant="warning">Warning alert</Alert>
      <Alert variant="error">Error alert</Alert>
    </div>
  );
}

function DraggableGlassButton({ label, variant }: { label: string; variant?: 'default' | 'primary' | 'danger' }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div
      style={{
        position: 'relative',
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 1000 : 1,
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      <GlassButton
        label={label}
        variant={variant}
        onClick={() => console.log(`${label} clicked!`)}
      />
    </div>
  );
}

function GlassButtonPreview() {
  return (
    <div 
      style={{ 
        display: 'flex', 
        gap: 12, 
        alignItems: 'center', 
        flexWrap: 'wrap',
        padding: '20px',
        minHeight: '200px'
      }}
    >
      <p style={{ marginBottom: '16px', color: 'var(--muted)', fontSize: '14px' }}>
        Drag the buttons around to test the glass effect over different content!
      </p>
      
      <DraggableGlassButton label="Default" />
      <DraggableGlassButton label="Primary" variant="primary" />
      <DraggableGlassButton label="Danger" variant="danger" />
    </div>
  );
}

function GlassModalPreview() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <GlassButton 
        label="Open Glass Modal" 
        variant="primary" 
        onClick={() => setIsOpen(true)} 
      />
      <GlassModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Glass Modal Example"
        size="md"
      >
        <p>This is a beautiful glass modal with backdrop blur and glass effects.</p>
        <p>You can see the content behind it with a nice blur effect, and the modal itself has the same liquid glass appearance as the glass buttons.</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <GlassButton 
            label="Confirm" 
            variant="primary" 
            onClick={() => setIsOpen(false)} 
          />
          <GlassButton 
            label="Cancel" 
            onClick={() => setIsOpen(false)} 
          />
        </div>
      </GlassModal>
    </div>
  );
}

export const items: ShowcaseItem[] = [
  {
    id: 'button',
    title: 'Button',
    code: `import { Button } from 'vitrio-ui';\n\n<Button>Default</Button>\n<Button variant="primary">Primary</Button>`,
    render: () => <ButtonPreview />,
  },
  {
    id: 'input',
    title: 'Input',
    code: `import { Input } from 'vitrio-ui';\n\n<Input placeholder="Type here" />`,
    render: () => <InputPreview />,
  },
  {
    id: 'card',
    title: 'Card',
    code: `import { Card } from 'vitrio-ui';\n\n<Card title="Card Title">This is a basic card.</Card>`,
    render: () => <CardPreview />,
  },
  {
    id: 'modal',
    title: 'Modal',
    code: `import { Modal, Button } from 'vitrio-ui';\n\n<Modal isOpen={open} onClose={() => setOpen(false)}>...</Modal>`,
    render: () => <ModalPreview />,
  },
  {
    id: 'navbar',
    title: 'Navbar',
    code: `import { Navbar } from 'vitrio-ui';\n\n<Navbar brand="Brand"><a href="#">Home</a></Navbar>`,
    render: () => <NavbarPreview />,
  },
  {
    id: 'tooltip',
    title: 'Tooltip',
    code: `import { Tooltip, Button } from 'vitrio-ui';\n\n<Tooltip text="Helpful info"><Button>Hover me</Button></Tooltip>`,
    render: () => <TooltipPreview />,
  },
  {
    id: 'badge',
    title: 'Badge',
    code: `import { Badge } from 'vitrio-ui';\n\n<Badge>Default</Badge>`,
    render: () => <BadgePreview />,
  },
  {
    id: 'spinner',
    title: 'Spinner',
    code: `import { Spinner } from 'vitrio-ui';\n\n<Spinner />`,
    render: () => <SpinnerPreview />,
  },
  {
    id: 'switch',
    title: 'Switch',
    code: `import { Switch } from 'vitrio-ui';\n\n<Switch checked={on} onChange={setOn} />`,
    render: () => <SwitchPreview />,
  },
  {
    id: 'alert',
    title: 'Alert',
    code: `import { Alert } from 'vitrio-ui';\n\n<Alert variant="success">Saved!</Alert>`,
    render: () => <AlertPreview />,
  },
  {
    id: 'glassbutton',
    title: 'GlassButton',
    code: `import { GlassButton } from 'vitrio-ui';\n\n<GlassButton label="Continue" variant="primary" onClick={() => console.log('clicked')} />`,
    render: () => <GlassButtonPreview />,
  },
  {
    id: 'glassmodal',
    title: 'GlassModal',
    code: `import { GlassModal } from 'vitrio-ui';\n\n<GlassModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title">\n  <p>Modal content with glass effect</p>\n</GlassModal>`,
    render: () => <GlassModalPreview />,
  },
]; 