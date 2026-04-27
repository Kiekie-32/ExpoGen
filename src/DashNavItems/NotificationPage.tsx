import { useState } from "react";
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  TrendingUp,
  Trash2,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type NotifType = "success" | "warning" | "info" | "update";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Document Generated",
    body: "Your Certificate of Origin for Cocoa Beans (Lot #A421) has been successfully generated and is ready for download.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Compliance Alert",
    body: 'Product "Shea Butter Grade A" is missing phytosanitary certification required for EU market entry. Update before shipment.',
    time: "1 hr ago",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "New Market Available",
    body: "AfCFTA preferential tariff rates for agricultural products to Egypt are now live. Check your Compliance page.",
    time: "3 hr ago",
    read: false,
  },
  {
    id: "4",
    type: "update",
    title: "Readiness Score Updated",
    body: "Your export readiness score improved from 62% to 78% after completing the product setup and compliance steps.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "5",
    type: "success",
    title: "AI Contract Ready",
    body: "The Lexi AI has drafted your export contract for the Netherlands shipment. Review and download from the Documents page.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "6",
    type: "info",
    title: "HS Code Verified",
    body: "Your selected HS code 1515.90 for Shea Butter has been cross-referenced with Ghana Revenue Authority's tariff schedule.",
    time: "2 days ago",
    read: true,
  },
];

const TYPE_STYLES: Record<
  NotifType,
  { icon: typeof Bell; bg: string; iconColor: string; dot: string }
> = {
  success: {
    icon: Check,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    dot: "bg-emerald-400",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    dot: "bg-amber-400",
  },
  info: {
    icon: Info,
    bg: "bg-teal-50",
    iconColor: "text-teal-600",
    dot: "bg-teal-400",
  },
  update: {
    icon: TrendingUp,
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    dot: "bg-blue-400",
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayed =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const markAllRead = () =>
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  const markRead = (id: string) =>
    setNotifications((n) =>
      n.map((x) => (x.id === id ? { ...x, read: true } : x)),
    );
  const deleteNotif = (id: string) =>
    setNotifications((n) => n.filter((x) => x.id !== id));

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
              Activity
            </p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Bell size={22} className="text-teal-500" />
              Notifications
              {unreadCount > 0 && (
                <span className="text-xs font-bold bg-teal-500 text-white px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Stay updated on your export journey activity.
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-100 px-3 py-2 rounded-lg transition-colors mt-6"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
          {(["all", "unread"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === tab
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab === "unread" ? `Unread (${unreadCount})` : "All"}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="space-y-2">
          <AnimatePresence>
            {displayed.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-200"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Bell size={20} className="text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  You're all caught up!
                </p>
                <p className="text-xs text-gray-400">
                  No unread notifications right now.
                </p>
              </motion.div>
            ) : (
              displayed.map((notif) => {
                const style = TYPE_STYLES[notif.type];
                const Icon = style.icon;
                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-4 bg-white border rounded-xl p-4 shadow-sm transition-all cursor-pointer hover:border-teal-100 hover:shadow-md ${
                      !notif.read ? "border-teal-100" : "border-gray-100"
                    }`}
                    onClick={() => markRead(notif.id)}
                  >
                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}
                    >
                      <Icon size={16} className={style.iconColor} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-bold ${!notif.read ? "text-gray-900" : "text-gray-600"}`}
                          >
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`}
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            {notif.time}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotif(notif.id);
                            }}
                            className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-red-50 hover:text-red-400 text-gray-300 transition-colors"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                        {notif.body}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
