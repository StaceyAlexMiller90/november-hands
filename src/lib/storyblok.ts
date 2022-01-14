import StoryblokClient, { StoryData } from 'storyblok-js-client';
import { useEffect, useState } from 'react';
import { Footer } from '../interfaces/stories';

const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_SECRET,
  cache: {
    clear: 'auto',
    type: 'memory'
  }
});

export function useStoryblok(preview: boolean, originalStory: StoryData, originalFooter: StoryData) {
  const [story, setStory] = useState(originalStory);
  const [footer, setFooter] = useState(originalFooter);

  // adds the events for updating the visual editor
  // see https://www.storyblok.com/docs/guide/essentials/visual-editor#initializing-the-storyblok-js-bridge
  function initEventListeners() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { StoryblokBridge } = window as any;
    if (typeof StoryblokBridge !== 'undefined') {
      // initialize the bridge with your token
      const storyblokInstance = new StoryblokBridge({
        resolveRelations: ['footer.activeLinks', 'footer.socials', 'product.category'],
        preventClicks: true
      });

      // reload on Next.js page on save or publish event in the Visual Editor
      storyblokInstance.on(['change', 'published'], () => window.location.reload());

      // live update the story on input events
      storyblokInstance.on('input', (event: StoryblokEventPayload) => {
        // check if the ids of the event and the passed story match
        if (story && event.story.content._uid === story.content._uid) {
          // change the story content through the setStory function
          setStory(event.story);
        }
        if (footer && event.story.content._uid === footer.content._uid) {
          setFooter(event.story);
        }
      });
    }
  }

  // appends the bridge script tag to our document
  // see https://www.storyblok.com/docs/guide/essentials/visual-editor#installing-the-storyblok-js-bridge
  function addBridge(callback: () => void) {
    // check if the script is already present
    const existingScript = document.getElementById('storyblokBridge');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = '//app.storyblok.com/f/storyblok-v2-latest.js';
      script.id = 'storyblokBridge';
      document.body.appendChild(script);
      script.onload = () => {
        // once the script is loaded, init the event listeners
        callback();
      };
    } else {
      callback();
    }
  }

  useEffect(() => {
    // only load inside preview mode
    if (preview) {
      // first load the bridge, then initialize the event listeners
      addBridge(initEventListeners);
    }
  }, [originalStory, preview, setStory, originalFooter, setFooter]); // runs the effect only once & defines effect dependencies

  useEffect(() => {
    setStory(originalStory);
    setFooter(originalFooter);
  }, [originalStory, originalFooter]);

  return { liveStory: story, liveFooter: footer };
}

export default Storyblok;
