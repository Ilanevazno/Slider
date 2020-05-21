import Panel from './Panel';

$('.js-panel').each((_index, element) => {
  const panel = new Panel(element);
});
