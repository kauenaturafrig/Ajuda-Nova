import Layout from "../../components//Layout";
import Link from "next/link";
import Image from "next/image";
import AnimatedDarkModeToggle from "../../components//AnimatedDarkModeToggle";

type DashboardItem = {
  title: string;
  href: string;
  color: string;
  icon?: string;
};

const dashboardItems: DashboardItem[] = [
  {
    title: "Sistemas Naturafrig",
    href: "/links-uteis",
    color: "bg-gray-400",
    icon: "/assets/images/icons/icons8-link-branco.png",
  },
  {
    title: "Ramais",
    href: "/ramais",
    color: "bg-yellow-500",
    icon: "/assets/images/icons/icons8-phone-branco.png",
  },
  {
    title: "Emails",
    href: "/emails",
    color: "bg-blue-700",
    icon: "/assets/images/icons/icons8-mail-branco.png",
  },
  {
    title: "Balanças",
    href: "/balancas",
    color: "bg-red-700",
    icon: "/assets/images/icons/icons8-scales-branco.png",
  },
  {
    title: "Leitores",
    href: "/leitores",
    color: "bg-orange-600",
    icon: "/assets/images/icons/icons8-barcode-reader-branco.png",
  },
  {
    title: "Tanuresoft",
    href: "/tanuresoft",
    color: "bg-green-700",
    icon: "/assets/images/icons/icons8-cmd-branco.png",
  },
  {
    title: "Impressora Zebra",
    href: "/impressoras-termicas",
    color: "bg-gray-500",
    icon: "/assets/images/icons/icons8-print-branco.png",
  },
  {
    title: "Windows",
    href: "/windows-page",
    color: "bg-blue-500",
    icon: "/assets/images/icons/icons8-windows-branco.png",
  },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="min-h-screen pt-9 p-6 my-auto">
        <div className="flex align-middle flex-wrap justify-between max-w-8xl mx-auto">
          <h1 className="text-5xl font-bold text-center text-gray-800 dark:text-white pt-9 pb-9 ml-14">
            Bem vindo!
          </h1>
          <div className="flex align-middle items-center">
            <p className="text-xl dark:text-white mr-5">Tema</p>
            <AnimatedDarkModeToggle />
          </div>
        </div>

        {/* Layout responsivo que evita esmagamento */}
        <div className="mx-auto mt-6 mb-6 w-[90%]">
          <div
            className="
              grid gap-6 justify-center
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-6
            "
          >
            {dashboardItems.map((item, index) => (
              <Link key={item.href} href={item.href} className="
                flex
                lg:[&:nth-last-child(1)]:col-span-3
                lg:[&:nth-last-child(2)]:col-span-3
                lg:[&:nth-last-child(3)]:col-span-2
                lg:[&:nth-last-child(4)]:col-span-2
                lg:[&:nth-last-child(5)]:col-span-2
                lg:[&:nth-last-child(6)]:col-span-2
                lg:[&:nth-last-child(7)]:col-span-2
                lg:[&:nth-last-child(8)]:col-span-2
                
                xl:[&:nth-last-child(1)]:col-span-3
                xl:[&:nth-last-child(2)]:col-span-3
                xl:[&:nth-last-child(3)]:col-span-2
                xl:[&:nth-last-child(4)]:col-span-2
                xl:[&:nth-last-child(5)]:col-span-2
                xl:[&:nth-last-child(6)]:col-span-2
                xl:[&:nth-last-child(7)]:col-span-2
                xl:[&:nth-last-child(8)]:col-span-2
              ">
                <div
                  className={`
                    group w-full h-[250px]
                    flex flex-col items-center justify-center
                    rounded-2xl text-white shadow-md p-6
                    text-lg font-semibold transition-all duration-300
                    cursor-pointer transform hover:scale-105 hover:shadow-xl
                    ${item.color} hover:brightness-110
                  `}
                >
                  {item.icon && (
                    <div className="w-[80px] h-[80px] mb-4 relative flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span className="text-center text-2xl sm:text-3xl lg:text-4xl leading-tight break-words px-2">
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
