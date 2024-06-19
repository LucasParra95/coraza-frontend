import Head from "next/head";
import Header from "components/header";
import { useRouter } from "next/router";

type LayoutType = {
  title?: string;
  children?: React.ReactNode;
};

export default ({ children, title = "Coraza" }: LayoutType) => {
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <div className="app-main">
      <Head>
        <title>Página no encontrada &mdash; {title}</title>
      </Head>

      <Header isErrorPage />

      <main className={pathname !== "/" ? "main-page" : ""}>{children}</main>
    </div>
  );
};
