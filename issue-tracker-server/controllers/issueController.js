import Issue from '../models/Issue.js';

// @desc    Create a new issue
// @route   POST /api/issues
// @access  Public
export const createIssue = async (req, res) => {
  try {
    const { title, description, severity, priority, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const issue = await Issue.create({
      title,
      description,
      severity,
      priority,
      status,
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all issues with filtering, searching, and pagination
// @route   GET /api/issues
// @access  Public
export const getIssues = async (req, res) => {
  try {
    const { status, priority, severity, search, page = 1, limit = 10 } = req.query;

    const query = {};

    // Apply filtering
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (severity) query.severity = severity;

    // Apply text search on title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalIssues = await Issue.countDocuments(query);
    const issues = await Issue.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalIssues / limitNum);

    res.status(200).json({
      issues,
      totalIssues,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single issue
// @route   GET /api/issues/:id
// @access  Public
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.status(200).json(issue);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid issue ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update an issue
// @route   PUT /api/issues/:id
// @access  Public
export const updateIssue = async (req, res) => {
  try {
    const { title, description, severity, priority, status } = req.body;

    let issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { title, description, severity, priority, status },
      { new: true, runValidators: true }
    );

    res.status(200).json(issue);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid issue ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete an issue
// @route   DELETE /api/issues/:id
// @access  Public
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    await issue.deleteOne();

    res.status(200).json({ message: 'Issue removed successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid issue ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
