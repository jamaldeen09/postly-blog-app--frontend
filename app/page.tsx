import LandingPage from "@/components/landingPageUi/LandingPage";
import Loader from "@/components/reusableUi/Loader";
import { Suspense } from "react";

const page = (): React.ReactElement => {
  return (
    <Suspense
      fallback={<Loader />}
    >
      <LandingPage />
    </Suspense>
  );
};

export default page;