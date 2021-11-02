export default {
  categories: [
    {
      name: 'Basic',
      isCategory: true,
      type: [
        {
          name: 'Container',
          description: 'This component contains things within itself',
          icon: 'ri-layout-row-fill',
          commonProps: {},
          type: []
        },
        {
          name: 'Text',
          description: 'This is a simple text component',
          icon: 'ri-t-box-fill',
          commonProps: {},
          type: [
            {
              _component: '@budibase/standard-components/heading',
              name: 'Headline',
              icon: 'headline',
              props: {
                type: {
                  type: 'options',
                  options: [
                    'h1',
                    'h2'
                  ],
                  'default': 'h1'
                }
              }
            },
            {
              _component: '@budibase/standard-components/text',
              name: 'Paragraph',
              icon: 'paragraph',
              props: {}
            }
          ]
        },
        {
          name: 'Button',
          description: 'A basic html button that is ready for styling',
          icon: 'ri-radio-button-fill',
          commonProps: {},
          type: []
        },
        {
          name: 'Icon',
          description: 'A basic component for displaying icons',
          icon: 'ri-sun-fill',
          commonProps: {},
          type: []
        },
        {
          name: 'Avatar',
          description: 'A basic component for rendering an avatar',
          icon: 'ri-user-smile-fill',
          commonProps: {},
          type: []
        },
        {
          name: 'Link',
          description: 'A basic link component for internal and external links',
          icon: 'ri-link',
          commonProps: {},
          type: []
        }
      ]
    },
    {
      name: 'Form',
      isCategory: true,
      type: [
        {
          name: 'Button',
          description: 'A basic html button that is ready for styling',
          icon: 'ri-radio-button-fill',
          commonProps: {},
          type: []
        },
        {
          name: 'Icon',
          description: 'A basic component for displaying icons',
          icon: 'ri-sun-fill',
          commonProps: {},
          type: []
        },
        {
          name: 'Avatar',
          description: 'A basic component for rendering an avatar',
          icon: 'ri-user-smile-fill',
          commonProps: {},
          type: []
        },
        {
          name: 'Link',
          description: 'A basic link component for internal and external links',
          icon: 'ri-link',
          commonProps: {},
          type: []
        }
      ]
    },
    {
      name: 'Blocks',
      isCategory: true,
      type: [
        {
          name: 'Card',
          description: 'A basic card component that can contain content and actions.',
          icon: 'ri-layout-bottom-line',
          commonProps: {},
          type: []
        },
        {
          name: 'Login',
          description: 'A component that automatically generates a login screen for your app.',
          icon: 'ri-login-box-fill',
          commonProps: {},
          type: []
        },
        {
          name: 'Navbar',
          description: 'A component for handling the navigation within your app.',
          icon: 'ri-navigation-fill',
          commonProps: {},
          type: []
        }
      ]
    },
    {
      name: 'Data',
      isCategory: true,
      type: [
        {
          name: 'Table',
          description: 'A component that generates a table from your data.',
          icon: 'ri-archive-drawer-fill',
          commonProps: {},
          modelRequired: true,
          type: []
        },
        {
          name: 'Form',
          description: 'A component that generates a form from your data.',
          icon: 'ri-file-edit-fill',
          commonProps: {},
          modelRequired: true,
          type: []
        }
      ]
    },
  ]
}