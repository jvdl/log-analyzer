import { BrowseLog } from './BrowseLog';
import renderer, { ReactTestRendererJSON, ReactTestRendererNode } from 'react-test-renderer';
import { describe, it, expect, vi } from 'vitest';

function isJsonNode(node?: ReactTestRendererNode): node is ReactTestRendererJSON {
  return node != null && typeof node !== 'string';
}

vi.mock('../util/constants', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../util/constants')>();
  return {
    ...mod,
    // replace some exports
    CHUNK_SIZE: 5,
  };
});

describe(BrowseLog, () => {

  it('renders correctly with expected data', () => {
    const tree = renderer
      .create(<BrowseLog logLines={['line 1', 'line 2']} />)
      .toJSON();
      expect(tree).toMatchSnapshot();
  });

  it('renders correctly with null data', () => {
    const tree = renderer
      // @ts-expect-error - passing null to a prop that expects an array
      .create(<BrowseLog logLines={null} />)
      .toJSON();
      expect(tree).toBeNull();
  });


  it('renders correctly when there are more lines than the chunk size', () => {
    const tree = renderer
      .create(<BrowseLog logLines={['line 1', 'line 2', 'line 3', 'line 4', 'line 5', 'line 6']} />)
      .toJSON() as ReactTestRendererJSON[] | null;

      // expect there to only be 5 lines in the 'raw-log'
      const rawLogNode = tree?.find(node => node.props.className === 'raw-log');
      const preNode = rawLogNode?.children?.[0];
      if (!isJsonNode(preNode)) {
        expect.fail('Expected preNode to be a ReactTestRendererJSON');
      }
      expect(preNode.children?.length).toBe(5);
  });

});
