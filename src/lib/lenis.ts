import Lenis from 'lenis'


export const lenisInstance = () => {
  // Initialize Lenis
const lenis = new Lenis({
  autoRaf: true,
});

// Listen for the scroll event and log the event data
lenis.on('scroll', (e:unknown) => {
  //console.log(e);
});
}

lenisInstance();