import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import router from 'next/router';
import Header from '../components/header';
import PageIntro from '../components/page-intro';
import Footer from '../components/footer';
import Hamburger from '../components/hamburger';
import Navigation from '../components/navigation';
import throttle from 'lodash/throttle';
import styles from './AppLayout.module.scss';
import { SbEditableContent } from 'storyblok-react';
import { Footer as TFooter } from '../interfaces/stories';

interface Props {
  intro?: SbEditableContent & {
    darkOverlay: boolean;
    headline: string;
    image: {
      focus: string;
      alt: string;
      filename: string;
    };
  };
  footer: TFooter;
  pageType: string;
}

const Layout: FC<Props> = ({ children, intro, footer, pageType }) => {
  const [isMobile, setIsMobile] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSolid, setIsSolid] = useState(false);
  const isDark = intro?.darkOverlay;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleScroll = throttle(() => {
    setIsSolid(window.scrollY > 0);
  }, 100);

  const handleSizeChange = (e: MediaQueryListEvent) => {
    setIsMobile(e.matches);
  };

  const handleRouteChange = () => {
    if (isMobile && mobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    setIsMobile(media.matches);

    media.addEventListener('change', handleSizeChange);
    router.events.on('routeChangeComplete', handleRouteChange);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      media.removeEventListener('change', handleSizeChange);
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <div className={classNames(styles.layout, { [styles.layout_mobileMenuOpen]: mobileMenuOpen })}>
      <Header isSolid={pageType === 'shop' ? true : isSolid} isDark={isDark}>
        <Hamburger isSolid={isSolid} inverted={isDark} mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
        <Navigation
          inverted={isDark}
          mobileMenuOpen={mobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          isMobile={isMobile}
          isSolid={isSolid}
        />
      </Header>
      {intro && <PageIntro blok={intro} />}
      <div className={classNames(styles.page, [styles[`page_${pageType}`]])}>{children}</div>
      <Footer blok={footer} />
    </div>
  );
};

export default Layout;
