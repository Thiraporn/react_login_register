import { ClockIcon, PlusCircleIcon, ListBulletIcon, ReceiptRefundIcon} from '@heroicons/react/24/solid'
export const navigationLinks = [
  {
    name: "Intro",
    subLinks: [
      {
        name: "Work time",
        description: "Log and manage your work time",
        link: "/work-time",
        color: "bg-teal-300 dark:bg-teal-700",
        icon: <ClockIcon />,
      },]
  }, { 
    name: "Portfolio",
    subLinks: [
      {
        name: "OList e-commerce",
        description: "Data Analysis(Projects)",
        link: "/create-project",
        color: "bg-green-300 dark:bg-green-700",
        icon: <PlusCircleIcon />,
      },
      {
        name: "Manage",
        description: "Manage projects",
        link: "/manage-projects",
        color: "bg-blue-300 dark:bg-blue-700",
        icon: <ListBulletIcon />,
      },
      {
        name: "Archive",
        description: "Manage all archived projects",
        link: "/archive-projects",
        color: "bg-red-300 dark:bg-red-700",
        icon: <ReceiptRefundIcon />,
      },
    ],

  }];