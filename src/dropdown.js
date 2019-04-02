// @flow
/**
 * A generic dropdown component.  It takes the children of the component
 * and hosts it in the component.  When the component is selected, it
 * drops-down the contentComponent and applies the contentProps.
 */
import React, { Component } from 'react'

import LoadingIndicator from './loading-indicator.js'

type Props = {
    children?: Object,
    contentComponent: Object,
    contentProps: Object,
    isLoading?: boolean,
    disabled?: boolean,
    shouldToggleOnHover?: boolean
}

type State = {
    expanded: boolean,
    hasFocus: boolean
}

class Dropdown extends Component<Props, State> {
    state = {
        expanded: false,
        hasFocus: false
    }

    componentWillUpdate() {
        document.addEventListener('touchstart', this.handleDocumentClick)
        document.addEventListener('mousedown', this.handleDocumentClick)
    }

    componentWillUnmount() {
        document.removeEventListener('touchstart', this.handleDocumentClick)
        document.removeEventListener('mousedown', this.handleDocumentClick)
    }

    wrapper: ?Object

    handleDocumentClick = (event: Event) => {
        if (this.wrapper && !this.wrapper.contains(event.target)) {
            this.setState({ expanded: false })
        }
    }

    handleKeyDown = (e: KeyboardEvent) => {
        switch (e.which) {
            case 27: // Escape
                this.toggleExpanded(false)
                break
            case 38: // Up Arrow
                this.toggleExpanded(false)
                break
            case 13: // Enter Key
            case 32: // Space
            case 40: // Down Arrow
                this.toggleExpanded(true)
                break
            default:
                return
        }

        e.preventDefault()
    }

    handleFocus = (e: { target: any }) => {
        const { hasFocus } = this.state

        if (e.target === this.wrapper && !hasFocus) {
            this.setState({ hasFocus: true })
        }
    }

    handleBlur = (e: { target: any }) => {
        const { hasFocus } = this.state

        if (hasFocus) {
            this.setState({ hasFocus: false })
        }
    }

    handleMouseEnter = (e: { target: any }) => {
        this.handleHover(true)
    }

    handleMouseLeave = (e: { target: any }) => {
        this.handleHover(false)
    }

    handleHover = (toggleExpanded: boolean) => {
        const { shouldToggleOnHover } = this.props

        if (shouldToggleOnHover) {
            this.toggleExpanded(toggleExpanded)
        }
    }

    toggleExpanded = (value: ?boolean) => {
        const { isLoading } = this.props
        const { expanded } = this.state

        if (isLoading) {
            return
        }

        const newExpanded = value === undefined ? !expanded : !!value

        this.setState({ expanded: newExpanded })

        if (!newExpanded && this.wrapper) {
            this.wrapper.focus()
        }
    }

    renderPanel() {
        const { contentComponent: ContentComponent, contentProps } = this.props

        return (
            <div className="dropdown-content" style={styles.panelContainer}>
                <ContentComponent {...contentProps} />
            </div>
        )
    }

    render() {
        const { expanded, hasFocus } = this.state
        const { children, isLoading, disabled, arrowRenderer } = this.props

        const expandedHeaderStyle = expanded
            ? styles.dropdownHeaderExpanded
            : undefined

        const focusedHeaderStyle = hasFocus
            ? styles.dropdownHeaderFocused
            : undefined

        const arrowStyle = expanded
            ? styles.dropdownArrowUp
            : styles.dropdownArrowDown

        const headingStyle = {
            ...styles.dropdownChildren,
            ...(disabled ? styles.disabledDropdownChildren : {})
        }

        return (
            <div
                className="dropdown"
                tabIndex="0"
                role="combobox"
                aria-expanded={expanded}
                aria-readonly="true"
                aria-disabled={disabled}
                style={styles.dropdownContainer}
                ref={ref => (this.wrapper = ref)}
                onKeyDown={this.handleKeyDown}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <div
                    className="dropdown-heading"
                    style={{
                        ...styles.dropdownHeader,
                        ...expandedHeaderStyle,
                        ...focusedHeaderStyle
                    }}
                    onClick={() => this.toggleExpanded()}
                >
                    <span
                        className="dropdown-heading-value"
                        style={headingStyle}
                    >
                        {children}
                    </span>
                    <span
                        className="dropdown-heading-loading-container"
                        style={styles.loadingContainer}
                    >
                        {isLoading && <LoadingIndicator />}
                    </span>
                    <span
                        className="dropdown-heading-dropdown-arrow"
                        style={styles.dropdownArrow}
                    >
                        {arrowRenderer ? (
                            arrowRenderer(expanded)
                        ) : (
                            <i style={arrowStyle} />
                        )}
                    </span>
                </div>
                {expanded && this.renderPanel()}
            </div>
        )
    }
}

const focusColor = '#78c008'

const styles = {
    dropdownArrow: {
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'table-cell',
        position: 'relative',
        textAlign: 'center',
        verticalAlign: 'middle',
        width: 25,
        zIndex: '2'
    },
    dropdownArrowDown: {
        boxSizing: 'border-box',
        borderColor: '#999 transparent transparent',
        borderStyle: 'solid',
        borderWidth: '5px 5px 2.5px',
        display: 'inline-block',
        height: 0,
        width: 0,
        position: 'relative'
    },
    dropdownArrowDownFocused: {},
    dropdownArrowUp: {
        boxSizing: 'border-box',
        top: '-2px',
        borderColor: 'transparent transparent #999',
        borderStyle: 'solid',
        borderWidth: '0px 5px 5px',
        display: 'inline-block',
        height: 0,
        width: 0,
        position: 'relative'
    },
    dropdownChildren: {
        boxSizing: 'border-box',
        bottom: 0,
        color: '#333',
        left: 0,
        paddingRight: 10,
        position: 'absolute',
        right: 0,
        top: 0,
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    disabledDropdownChildren: {
        opacity: 0.5
    },
    dropdownContainer: {
        position: 'relative',
        boxSizing: 'border-box',
        outline: 'none'
    },
    dropdownHeader: {
        boxSizing: 'border-box',
        backgroundColor: '#f6f6f6',
        color: '#c8c8c8',
        cursor: 'default',
        display: 'table',
        borderSpacing: 0,
        borderCollapse: 'separate',
        outline: 'none',
        overflow: 'hidden',
        position: 'relative',
        width: '100%'
    },
    dropdownHeaderFocused: {
        borderColor: focusColor,
        boxShadow: 'none'
    },
    dropdownHeaderExpanded: {
        borderBottomRightRadius: '0px',
        borderBottomLeftRadius: '0px'
    },
    loadingContainer: {
        cursor: 'pointer',
        display: 'table-cell',
        verticalAlign: 'middle',
        width: '16px'
    },
    panelContainer: {
        backgroundColor: '#fff',
        boxShadow: '0 3px 8px 0 rgba(0,0,0,0.09)',
        boxSizing: 'border-box',
        position: 'absolute',
        top: '100%',
        width: '100%',
        zIndex: 1,
        overflowY: 'auto'
    }
}

export default Dropdown
