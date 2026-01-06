import Layout from "../../components//Layout";
import Link from "next/link";
import Image from "next/image";
import DarkModeToggle from "../../components//DarkModeToggle";
import AnimatedDarkModeToggle from "../../components//AnimatedDarkModeToggle";

type DashboardItem = {
  title: string;
  href: string;
  color: string;
  icon?: string;
};

const dashboardItems: DashboardItem[] = [
  {
    title: "Ramais",
    href: "/ramais",
    color: "bg-yellow-500",
    icon: "/assets/images/icons/icons8-phone-branco.png",
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
          <h1 className="text-5xl font-bold text-center text-gray-800 dark:text-white pt-9 pb-9">
            Painel de Controle
          </h1>
          <div className="flex align-middle items-center">
            <p className="text-xl dark:text-white mr-5">Tema</p>
            <AnimatedDarkModeToggle />
          </div>
        </div>

        {/* Layout responsivo que evita esmagamento */}
        <div className=" mx-auto mt-6 mb-6">
          {/* Container flexível que quebra em linhas quando necessário */}
          <div className="flex flex-wrap justify-center gap-6">
            {/* Container dos primeiros 6 itens */}
            <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
              {dashboardItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`
                  w-[300px] sm:w-[320px] md:w-[350px] lg:w-[380px] xl:w-[420px]
                  h-[250px] 
                  flex flex-col items-center justify-center 
                  rounded-2xl text-white shadow-md p-6 
                  text-lg font-semibold transition-all duration-300 
                  cursor-pointer transform hover:scale-105 hover:shadow-xl 
                  ${item.color} hover:brightness-110
                `}
                  >
                    {item.icon && (
                      <div className="w-16 h-16 mb-4 relative flex-shrink-0">
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

            {/* Item Links - cresce apenas em telas grandes */}
            <div className="flex justify-center">
              <Link href={"/links-uteis"}>
                <div
                  className={`
                w-[300px] sm:w-[320px] md:w-[350px] lg:w-[380px] xl:w-[862px]
                h-[250px] lg:h-[520px] xl:h-[800px]
                flex flex-col items-center justify-center 
                rounded-2xl text-white shadow-md p-6 
                text-lg bg-gray-400 font-semibold transition-all duration-300 
                cursor-pointer transform hover:scale-105 hover:shadow-xl hover:brightness-110
              `}
                >
                  <div className="w-16 h-16 mb-4 relative flex-shrink-0">
                    <Image
                      src={"/assets/images/icons/icons8-link-branco.png"}
                      alt={"link"}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-center text-2xl sm:text-3xl lg:text-4xl leading-tight break-words px-2">
                    Links
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
