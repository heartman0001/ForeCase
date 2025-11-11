import { NavLink } from "react-router-dom"
import { Home, Users, Briefcase, Bell, FileText, Layers } from "lucide-react"

export default function Sidebar() {
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { path: "/invoiceRecord", label: "InvoiceRecord(การวางบิล การรับเงิน)", icon: <Home className="w-5 h-5" /> },
    { path: "/customers", label: "Customers(ลูกค้า)", icon: <Users className="w-5 h-5" /> },
    { path: "/projects", label: "Projects(โปรเจค)", icon: <Briefcase className="w-5 h-5" /> },
    { path: "/installments", label: "Installments(หน้าการผ่อนชำระ)", icon: <Layers className="w-5 h-5" /> },
    // { path: "/users", label: "Users", icon: <FileText className="w-5 h-5" /> },
    { path: "/notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { path: "/reports", label: "Reports(รายงาน)", icon: <FileText className="w-5 h-5" /> }

  ]

  return (
    <div className="w-64 bg-white text-[#2826a9] min-h-screen flex flex-col p-4 shadow-lg">
  {/* Logo */}
  <div className="flex items-center justify-center mb-6">
    <img
      src="https://www.wewebplus.com/img/static/wewebplus.svg"
      alt="Logo"
      className="h-12"
    />
  </div>

  {/* Title */}
  <h1 className="text-lg font-bold mb-6 text-center text-[#2826a9]">
    Forecast Cash
  </h1>

  {/* Navigation */}
  <nav className="space-y-2">
    {navItems.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200
           ${isActive ? "bg-[#2b71ed] text-white font-semibold" : "hover:bg-[#2826a9]/10"}`
        }
      >
        {item.icon}
        <span>{item.label}</span>
      </NavLink>
    ))}
  </nav>
</div>

  )
}
