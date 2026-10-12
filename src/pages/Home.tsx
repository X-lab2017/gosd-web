import { LangProvider } from '@/i18n';
import { ThemeProvider } from '@/theme';
import Nav from '@/sections/Nav';
import Hero from '@/sections/Hero';
import Ch1 from '@/sections/Ch1';
import GOSO from '@/sections/GOSO';
import Rankings from '@/sections/Rankings';
import Landscape from '@/sections/Landscape';
import GOSM from '@/sections/GOSM';
import { Summary, Declaration, Conclusion, Appendix, Footer } from '@/sections/LightSections';

export default function Home() {
  return (
    <ThemeProvider>
      <LangProvider>
        <Nav />
        <main>
          <Hero />
          <Summary />
          <Declaration />
          <Ch1 />
          <GOSO />
          <Rankings />
          <Landscape />
          <GOSM />
          <Conclusion />
          <Appendix />
        </main>
        <Footer />
      </LangProvider>
    </ThemeProvider>
  );
}
