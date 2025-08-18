import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Card,
  Modal,
  Navbar,
  Tooltip,
  Badge,
  Spinner,
  Switch,
  Alert,
  GlassButton,
  CircularGlassButton,
  GlassNavbar,
  GlassHeroBanner,
  GlassSidebar,
  GlassProjectCard,
  GlassUserInfo,
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
        flexDirection: 'column',
        gap: 12,
        padding: '20px',
        minHeight: '200px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <DraggableGlassButton label="Default" />
        <DraggableGlassButton label="Primary" variant="primary" />
        <DraggableGlassButton label="Danger" variant="danger" />
      </div>
      <p style={{ marginTop: '8px', color: 'var(--muted)', fontSize: '14px' }}>
        Drag the buttons around to test the glass effect over different content!
      </p>
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

function DraggableCircularGlassButton(
  props: {
    kind?: 'close' | 'info' | 'prev' | 'next' | 'default' | 'custom';
    variant?: 'default' | 'primary' | 'danger';
    size?: number | 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    disabled?: boolean;
    children?: React.ReactNode;
  }
) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

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
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      <CircularGlassButton {...props} />
    </div>
  );
}

function CircularGlassButtonPreview() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '20px',
        minHeight: '200px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <DraggableCircularGlassButton kind="close" size="sm" />
        <DraggableCircularGlassButton kind="info" />
        <DraggableCircularGlassButton kind="prev" variant="primary" />
        <DraggableCircularGlassButton kind="next" variant="danger" />
        <DraggableCircularGlassButton kind="custom" icon={<span>?</span>} size={56} variant="primary" />
        <DraggableCircularGlassButton kind="info" disabled />
        <DraggableCircularGlassButton kind="default" size={56}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>OK</span>
        </DraggableCircularGlassButton>
      </div>
      <p style={{ marginTop: '8px', color: 'var(--muted)', fontSize: '14px' }}>
        Drag the circular buttons around to test the glass effect over different content!
      </p>
    </div>
  );
}

function GlassNavbarPreview() {
  const demoItems = [
    { label: 'Home', href: '#' },
    { label: 'Docs', href: '#docs' },
    { label: 'About', href: '#about' },
  ];
  return (
    <div style={{ minHeight: 240 }}>
      <DraggableGlassNavbar navItems={demoItems} />
      <div style={{ padding: '72px 16px 16px 16px', color: 'var(--muted)' }}>
        <p>
          This is a preview area to showcase the transparent sticky GlassNavbar. Resize the
          viewport to see the mobile hamburger and dropdown.
        </p>
      </div>
    </div>
  );
}

function GlassHeroBannerPreview() {
  return (
    <div style={{ minHeight: 400 }}>
      <GlassHeroBanner
        title="Build glassy, modern interfaces"
        subtitle="Vitrio provides a lightweight set of liquid-glass components built with React and TypeScript."
        backgroundImageUrl="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2400&auto=format&fit=crop"
        ctaButtons={[
          { label: 'Get Started', onClick: () => console.log('Get Started') },
          { label: 'Docs', onClick: () => console.log('Docs') },
        ]}
        textColor="#e6e7ea"
        mutedColor="#b3b8c2"
      />
    </div>
  );
}

function GlassSidebarPreview() {
  const [open, setOpen] = useState(false);
  const menu = Array.from({ length: 6 }, (_, i) => ({
    label: `Item${i + 1}`,
    onClick: () => console.log(`Item${i + 1}`)
  }));
  
  const sampleUser = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com", 
    role: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    isOnline: true,
    notificationCount: 3
  };

  return (
    <div style={{ position: 'relative', minHeight: 400 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <CircularGlassButton
          kind="default"
          size={56}
          ariaLabel={open ? 'Close sidebar' : 'Open sidebar'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`demo-hamburger ${open ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </CircularGlassButton>
      </div>
      <GlassSidebar 
        menuItems={menu} 
        position="left" 
        isOpen={open} 
        onClose={() => setOpen(false)}
        userInfo={sampleUser}
        onUserProfileClick={() => console.log('Profile clicked')}
        onUserSettingsClick={() => console.log('Settings clicked')}
        onUserLogoutClick={() => console.log('Logout clicked')}
        onUserNotificationsClick={() => console.log('Notifications clicked')}
      />
    </div>
  );
}

function GlassUserInfoPreview() {
  const [compactMode, setCompactMode] = useState(false);
  
  const sampleUsers = [
    {
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      role: "Senior Developer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      isOnline: true,
      notificationCount: 5
    },
    {
      name: "Michael Rodriguez",
      email: "m.rodriguez@company.com", 
      role: "Product Manager",
      isOnline: false,
      notificationCount: 0
    },
    {
      name: "Emma Thompson",
      email: "emma.t@company.com",
      role: "UX Designer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      isOnline: true,
      notificationCount: 12
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <label style={{ color: 'var(--text)', fontSize: 14 }}>
          <input 
            type="checkbox" 
            checked={compactMode} 
            onChange={(e) => setCompactMode(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Compact Mode
        </label>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
        gap: 16,
        alignItems: 'start'
      }}>
        {sampleUsers.map((user, index) => (
          <GlassUserInfo
            key={index}
            user={user}
            compact={compactMode}
            onProfileClick={() => console.log(`${user.name} profile clicked`)}
            onSettingsClick={() => console.log(`${user.name} settings clicked`)}
            onLogoutClick={() => console.log(`${user.name} logout clicked`)}
            onNotificationsClick={() => console.log(`${user.name} notifications clicked`)}
          />
        ))}
      </div>
      
      <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '8px' }}>
        Interactive user info cards with glass styling, online status, notification badges, and action buttons.
      </p>
    </div>
  );
}

// (draggable demo removed)
function DraggableGlassNavbar({ navItems }: { navItems: { label: string; href: string }[] }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

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
        userSelect: 'none',
        width: 'max-content'
      }}
      onMouseDown={handleMouseDown}
    >
      <GlassNavbar navItems={navItems} disableSticky />
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
    id: 'glassherobanner',
    title: 'GlassHeroBanner',
    code: `import { GlassHeroBanner } from 'vitrio-ui';\n\n<GlassHeroBanner\n  title="Build glassy, modern interfaces"\n  subtitle="Vitrio provides a lightweight set of liquid-glass components built with React and TypeScript."\n  backgroundImageUrl="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2400&auto=format&fit=crop"\n  ctaButtons={[\n    { label: 'Get Started', onClick: () => {} },\n    { label: 'Docs', onClick: () => {} },\n  ]}\n/>`,
    render: () => <GlassHeroBannerPreview />,
  },
  {
    id: 'glasssidebar',
    title: 'GlassSidebar',
    code: `import { GlassSidebar } from 'vitrio-ui';\n\n<GlassSidebar\n  menuItems={[\n    { label: 'Dashboard' },\n    { label: 'Projects' },\n    { label: 'Settings' },\n  ]}\n  userInfo={{\n    name: "Alex Johnson",\n    email: "alex.johnson@example.com",\n    role: "Product Designer",\n    avatar: "https://...",\n    isOnline: true,\n    notificationCount: 3\n  }}\n  position="left"\n  isOpen={true}\n/>`,
    render: () => <GlassSidebarPreview />,
  },
  {
    id: 'glassuserinfo',
    title: 'GlassUserInfo',
    code: `import { GlassUserInfo } from 'vitrio-ui';\n\n<GlassUserInfo\n  user={{\n    name: "Sarah Chen",\n    email: "sarah.chen@company.com",\n    role: "Senior Developer",\n    avatar: "https://...",\n    isOnline: true,\n    notificationCount: 5\n  }}\n  onProfileClick={() => {}}\n  onSettingsClick={() => {}}\n  onLogoutClick={() => {}}\n  onNotificationsClick={() => {}}\n/>`,
    render: () => <GlassUserInfoPreview />,
  },
  {
    id: 'glassprojectcard',
    title: 'GlassProjectCard',
    code: `import { GlassProjectCard } from 'vitrio-ui';\n\n<GlassProjectCard\n  title="Project Alpha"\n  description="A blazing fast UI library demo."\n  imageUrl="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"\n  tags={["React", "TypeScript", "Shaders"]}\n  demoLink="#"\n  codeLink="#"\n  buttonTextTheme="light"\n/>`,
    render: () => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 16, width: '100%', alignItems: 'start' }}>
        <GlassProjectCard
          title="Project Alpha"
          description="A blazing fast UI library demo."
          imageUrl="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
          tags={["React", "TypeScript", "Shaders"]}
          demoLink="#"
          codeLink="#"
          buttonTextTheme="light"
        />
        <GlassProjectCard
          title="Project Beta"
          description="Elegant components with liquid glass aesthetics."
          imageUrl="https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1200&auto=format&fit=crop"
          tags={["UI", "Design"]}
          buttonTextTheme="light"
        />
      </div>
    ),
  },
  {
    id: 'glassnavbar',
    title: 'GlassNavbar',
    code: `import { GlassNavbar } from 'vitrio-ui';\n\n<GlassNavbar navItems={[\n  { label: 'Home', href: '#' },\n  { label: 'Docs', href: '#docs' },\n  { label: 'About', href: '#about' },\n]} />`,
    render: () => <GlassNavbarPreview />,
  },
  {
    id: 'circular-glassbutton',
    title: 'CircularGlassButton',
    code: `import { CircularGlassButton } from 'vitrio-ui';\n\n<div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>\n  <CircularGlassButton kind="close" size="sm" />\n  <CircularGlassButton kind="info" />\n  <CircularGlassButton kind="prev" variant="primary" />\n  <CircularGlassButton kind="next" variant="danger" />\n  <CircularGlassButton kind="custom" icon={<span>?</span>} size={56} variant="primary" />\n  <CircularGlassButton kind="default" size={56}>OK</CircularGlassButton>\n</div>`,
    render: () => <CircularGlassButtonPreview />,
  },
  {
    id: 'glassmodal',
    title: 'GlassModal',
    code: `import { GlassModal } from 'vitrio-ui';\n\n<GlassModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title">\n  <p>Modal content with glass effect</p>\n</GlassModal>`,
    render: () => <GlassModalPreview />,
  },
]; 