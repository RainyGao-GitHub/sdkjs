/*
 *
 * (c) Copyright Ascensio System Limited 2010-2016
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7  3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7  3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/
"use strict";

CImageShape.prototype.addToDrawingObjects =  CShape.prototype.addToDrawingObjects;
CImageShape.prototype.setDrawingObjects = CShape.prototype.setDrawingObjects;
CImageShape.prototype.setDrawingBase = CShape.prototype.setDrawingBase;
CImageShape.prototype.deleteDrawingBase = CShape.prototype.deleteDrawingBase;
CImageShape.prototype.addToRecalculate = CShape.prototype.addToRecalculate;
CImageShape.prototype.convertPixToMM = CShape.prototype.convertPixToMM;
CImageShape.prototype.getCanvasContext = CShape.prototype.getCanvasContext;
CImageShape.prototype.getHierarchy = CShape.prototype.getHierarchy;
CImageShape.prototype.getParentObjects = CShape.prototype.getParentObjects;
CImageShape.prototype.recalculateTransform = CShape.prototype.recalculateTransform;
CImageShape.prototype.recalculateBounds = CShape.prototype.recalculateBounds;
CImageShape.prototype.deselect = CShape.prototype.deselect;
CImageShape.prototype.hitToHandles = CShape.prototype.hitToHandles;
CImageShape.prototype.hitInBoundingRect = CShape.prototype.hitInBoundingRect;
CImageShape.prototype.getRotateAngle = CShape.prototype.getRotateAngle;
CImageShape.prototype.setWorksheet = CShape.prototype.setWorksheet;
CImageShape.prototype.getDrawingObjectsController = CShape.prototype.getDrawingObjectsController;
CImageShape.prototype.Is_UseInDocument = CShape.prototype.Is_UseInDocument;

CImageShape.prototype.setRecalculateInfo = function()
{
    this.recalcInfo =
    {
        recalculateBrush:          true,
        recalculatePen:            true,
        recalculateTransform:      true,
        recalculateBounds:         true,
        recalculateGeometry:       true,
        recalculateStyle:          true,
        recalculateFill:           true,
        recalculateLine:           true,
        recalculateTransparent:    true
    };
    this.bounds = {l: 0, t: 0, r: 0, b:0, w: 0, h:0};
    this.lockType = c_oAscLockTypes.kLockTypeNone;
};

CImageShape.prototype.recalcBrush = function()
{
    this.recalcInfo.recalculateBrush = true;
};

CImageShape.prototype.recalcPen = function()
{
    this.recalcInfo.recalculatePen = true;
};
CImageShape.prototype.recalcTransform = function()
{
    this.recalcInfo.recalculateTransform = true;
};
CImageShape.prototype.recalcBounds = function()
{
    this.recalcInfo.recalculateBounds = true;
};
CImageShape.prototype.recalcGeometry = function()
{
    this.recalcInfo.recalculateGeometry = true;
};
CImageShape.prototype.recalcStyle = function()
{
    this.recalcInfo.recalculateStyle = true;
};
CImageShape.prototype.recalcFill = function()
{
    this.recalcInfo.recalculateFill = true;
};
CImageShape.prototype.recalcLine = function()
{
    this.recalcInfo.recalculateLine = true;
};
CImageShape.prototype.recalcTransparent = function()
{
    this.recalcInfo.recalculateTransparent = true;
};
CImageShape.prototype.handleUpdatePosition = function()
{
    this.recalcTransform();
	this.recalcBounds();
    this.addToRecalculate();
    //delete this.fromSerialize;
};
CImageShape.prototype.handleUpdateExtents = function()
{
    this.recalcGeometry();
    this.recalcBounds();
    this.recalcTransform();
    this.addToRecalculate();
    //delete this.fromSerialize;
};
CImageShape.prototype.handleUpdateRot = function()
{
    this.recalcTransform();
    this.recalcBounds();
    this.addToRecalculate();
    //delete this.fromSerialize;
};
CImageShape.prototype.handleUpdateFlip = function()
{
    this.recalcTransform();
    this.addToRecalculate();
    //delete this.fromSerialize;
};
CImageShape.prototype.handleUpdateFill = function()
{
    this.recalcBrush();
    this.addToRecalculate();
};
CImageShape.prototype.handleUpdateLn = function()
{
    this.recalcLine();
    this.addToRecalculate();
};
CImageShape.prototype.handleUpdateGeometry = function()
{
	this.recalcBounds();
    this.recalcGeometry();
    this.addToRecalculate();
};
CImageShape.prototype.convertPixToMM = CShape.prototype.convertPixToMM;
CImageShape.prototype.getCanvasContext = CShape.prototype.getCanvasContext;
CImageShape.prototype.getCompiledStyle = CShape.prototype.getCompiledStyle;
CImageShape.prototype.getHierarchy = CShape.prototype.getHierarchy;
CImageShape.prototype.getParentObjects = CShape.prototype.getParentObjects;
CImageShape.prototype.recalculate = function () 
{
    if(this.bDeleted)
        return;
    ExecuteNoHistory(function(){
    if (this.recalcInfo.recalculateBrush) {
        this.recalculateBrush();
        this.recalcInfo.recalculateBrush = false;
    }

    if (this.recalcInfo.recalculatePen) {
        this.recalculatePen();
        this.recalcInfo.recalculatePen = false;
    }
    if (this.recalcInfo.recalculateTransform) {
        this.recalculateTransform();
        this.calculateSnapArrays();
        this.recalcInfo.recalculateTransform = false;
    }

    if (this.recalcInfo.recalculateGeometry) {
        this.recalculateGeometry();
        this.recalcInfo.recalculateGeometry = false;
    }
    if(this.recalcInfo.recalculateBounds)
    {
        this.recalculateBounds();
        this.recalcInfo.recalculateBounds = false;
    }
    }, this, []);
};
CImageShape.prototype.recalculateBounds = CShape.prototype.recalculateBounds;
CImageShape.prototype.hitInInnerArea = CShape.prototype.hitInInnerArea;
CImageShape.prototype.hitInPath = CShape.prototype.hitInPath;
CImageShape.prototype.hitToHandles = CShape.prototype.hitToHandles;
CImageShape.prototype.hitInBoundingRect = CShape.prototype.hitInBoundingRect;
CImageShape.prototype.getNumByCardDirection = CShape.prototype.getNumByCardDirection;
CImageShape.prototype.getCardDirectionByNum = CShape.prototype.getCardDirectionByNum;
CImageShape.prototype.getResizeCoefficients = CShape.prototype.getResizeCoefficients;
CImageShape.prototype.check_bounds = CShape.prototype.check_bounds;
CImageShape.prototype.normalize = CShape.prototype.normalize;
