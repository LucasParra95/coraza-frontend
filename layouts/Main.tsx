import Head from "next/head";
import Header from "components/header";
import { useRouter } from "next/router";
import { useContext } from "react";
import { ThemeContext } from "components/context/theme-context";

type LayoutType = {
  title?: string;
  children?: React.ReactNode;
};

export default ({ children, title = "Coraza" }: LayoutType) => {
  const { theme } = useContext(ThemeContext);

  const router = useRouter();
  const pathname = router.pathname;

  return (
    <div className="app-main" data-theme={theme}>
      <link
        href='https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap'
        rel='stylesheet'
      />
      <Head>
        <title>{title}</title>
      </Head>

      <Header />
      <main className={pathname !== "/" ? "main-page" : "main-home-page"}>
        {children}
      </main>
    </div>
  );
};
