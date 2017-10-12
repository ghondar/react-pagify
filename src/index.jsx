import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';

const defaultTags = {
  container: {
    tag: 'div',
    design: 'div',
    props: {}
  },
  segment: {
    tag: 'div',
    design: 'div',
    props: {}
  },
  ellipsis: {
    tag: 'div',
    design: 'div',
    props: {
      children: '…'
    }
  },
  link: {
    tag: 'span',
    design: 'div',
    props: {}
  }
};

class Context extends React.Component {
  getChildContext() {
    return {
      segments: this.props.segments,
      onSelect: this.props.onSelect,
      tags: this.tags
    };
  }
  get tags() {
    return merge({}, defaultTags, this.props.tags);
  }
  render() {
    const {onSelect, segments, tags, ...props} = this.props; // eslint-disable-line max-len, no-unused-vars
    const Container = this.tags.container;

    return <Container.tag {...Container.props} {...props}>{this.props.children}</Container.tag>;
  }
}
Context.propTypes = {
  children: PropTypes.any,
  onSelect: PropTypes.func,
  segments: PropTypes.object,
  tags: PropTypes.object
};
Context.childContextTypes = {
  onSelect: PropTypes.func,
  segments: PropTypes.object,
  tags: PropTypes.object
};

class Segment extends React.Component {
  render() {
    const context = this.context;
    const { field, ...props } = this.props;
    const segments = context.segments;
    const onSelect = context.onSelect;
    const tags = context.tags;
    const Tag = tags.segment.tag;
    const Design = tags.segment.design;
    const Link = tags.link.tag;
    const pages = segments[field];

    return (<Tag {...tags.segment.props} {...props}>{pages.map((page) =>
      <Design {...tags.segment.props}>                                                         
        <Link
          {...tags.link.props}
          key={`page-${page}`}
          onClick={(e) => onSelect(page, e)}>{page}</Link>
      </Design>
    )}</Tag>);
  }
}
Segment.propTypes = {
  field: PropTypes.string.isRequired
};
Segment.contextTypes = {
  onSelect: PropTypes.func,
  segments: PropTypes.object,
  tags: PropTypes.object
};

class Button extends React.Component {
  render() {
    const context = this.context;
    const { page, children, ...props } = this.props;
    const onSelect = context.onSelect;
    const tags = context.tags;
    const Tag = tags.segment.tag;
    const Design = tags.segment.design;
    const Link = tags.link.tag;

    return (<Tag {...tags.segment.props} {...props}>
      <Design {...tags.segment.props}>
        <Link
          {...tags.link.props}
          onClick={(e) => onSelect(page, e)}>{children}</Link>
      </Design>
    </Tag>);
  }
}
Button.propTypes = {
  children: PropTypes.any,
  page: PropTypes.number.isRequired
};
Button.contextTypes = {
  onSelect: PropTypes.func,
  tags: PropTypes.object
};

class Ellipsis extends React.Component {
  render() {
    const context = this.context;
    const { previousField, nextField, ...props } = this.props;
    const segments = context.segments;
    const tags = context.tags;
    const Tag = tags.ellipsis.tag;
    const Design = tags.ellipsis.design;
    const previousPages = segments[previousField];
    const nextPages = segments[nextField];
    const showEllipsis = nextPages[0] - previousPages.slice(-1)[0] > 1;

    if(showEllipsis) {
      return (
        <Design {...tags.ellipsis.props}>
          <Tag {...tags.ellipsis.props} {...props}/>
        </Design>
      )
    }

    return null;
  }
}
Ellipsis.propTypes = {
  children: PropTypes.any,
  previousField: PropTypes.string.isRequired,
  nextField: PropTypes.string.isRequired,
};
Ellipsis.contextTypes = {
  segments: PropTypes.object,
  tags: PropTypes.object
};

export default {
  Context,
  Segment,
  Button,
  Ellipsis
};
