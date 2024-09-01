import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let createBlog

  beforeEach(() => {
    createBlog = vi.fn()
    render(<BlogForm createBlog={createBlog} />)
  })

  test('renders properly', () => {
    expect(screen.getByRole('heading')).toHaveTextContent('create new')
    expect(screen.getByLabelText('title:'))
    expect(screen.getByLabelText('author:'))
    expect(screen.getByLabelText('url:'))
    expect(screen.getByRole('button')).toHaveTextContent('create')
  })

  test('passes the right arguments to the event handler when form is submitted', async () => {
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('title:'), 'The Best Essay')
    await user.type(screen.getByLabelText('author:'), 'Paul Graham')
    await user.type(screen.getByLabelText('url:'), 'https://paulgraham.com/best.html')

    await user.click(screen.getByRole('button'))

    expect(createBlog.mock.calls[0][0]).toMatchObject({
      title: 'The Best Essay',
      author: 'Paul Graham',
      url: 'https://paulgraham.com/best.html',
    })
  })
})
