import { useDesign } from "./DesignContext";
import { HomePage } from "../components/pages/Homepage/Home";       // Your first design
import { HomePageNew } from "../components/pages/Homepage copy/HomeNew"; // Your second design

export const HomePageContainer = () => {
  const { designMode } = useDesign();

  // This ensures that when the user clicks the button in the Navbar,
  // the home page swaps between the two designs instantly.
  return designMode === 'modern' ? <HomePageNew /> : <HomePage />;
};

export default HomePageContainer;